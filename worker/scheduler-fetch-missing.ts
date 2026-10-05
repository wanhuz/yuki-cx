import { getAnime } from "../lib/api/animebytes.js";
import { getActiveSeries, processMissingEpisode } from "../worker/scheduler-helper.js";
import { PrismaClient } from '@prisma/client';
import { getABSettings, getQBClientSettings } from "../lib/api/settings.js";
import { ABAuth } from "../lib/interface/animebytes.js";
import { validateSeriesFilter } from "../lib/util/animebytes.js";

type qbSettings = {
  qb_url: string;
  qb_port: number;
  qb_username: string;
  qb_password: string;
  qb_pause_torrent: boolean;
  qb_default_label: string;
  qb_scheduler_default_label: string;
};

const prisma = new PrismaClient();

async function searchAnimeAB(ab_id: number, ab_anime_title: string) {
    const abSettings = await getABSettings();

    const ab_auth = {
        username: abSettings.ab_username,
        passkey: abSettings.ab_key
    } as ABAuth;

    const result = await getAnime(ab_auth, ab_anime_title, ab_id);

    return result;
}

async function isTorrentProcessed(torrentId: number) {
    const torrent = await prisma.processedTorrent.findUnique({
        where: { torrent_id: torrentId }
    });

    return torrent ? true : false;
}
//  TO FIX: Process according to scheduler filter
async function startProcessingMissingEpisode(qbSettings: qbSettings) {
    const series = await getActiveSeries();

    for (const item of series) {
        console.log(`Processing missing episode for series ${item.series_name}... ${item.ab_id}`);

        const result = await searchAnimeAB(item.ab_id, item.series_name!);

        if (!result) {
            throw new Error(`Series ${item.ab_id} not found on AB.`);
        }

        const seriesFilter = await prisma.animeSchedulerFilter.findMany({where: {scheduler_id: item.id}});

        for (const torrent of result.Torrents) {

            if (await isTorrentProcessed(torrent.ID)) {
                console.log(`Torrent ${torrent.ID} already processed. Skipping...`);
                continue;
            }

            const isMatchingFilter = validateSeriesFilter(seriesFilter, torrent.Property);

            if (!isMatchingFilter) {
                console.log(`Torrent ${torrent.ID} does not match filter. Skipping...`);
                continue;
            }

            if (torrent.FileList.length > 1) {
                console.log(`Torrent ${torrent.ID} has multiple files. Possibly a batch file. Skipping...`);
                continue;
            }

            console.log(`Processing missing episode for series ${item.series_name} - ${torrent.Property}...`);

            await processMissingEpisode(
                qbSettings, 
                item.ab_id, 
                torrent.Link, 
                torrent.ID, 
                torrent.Property
            );
        }  
    }
}

async function main() {
    const qbSettings = await getQBClientSettings() as qbSettings;

    await startProcessingMissingEpisode(qbSettings);
}

main()
    .catch((error) => {
        console.error("Fetching missing scheduler episode failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });