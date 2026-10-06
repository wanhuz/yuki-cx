'use server';

import { getAnime } from "@/lib/api/animebytes";
import { PrismaClient } from '@prisma/client';
import { addToLog, getABSettings, getQBClientSettings } from "@/lib/api/settings";
import { ABAuth } from "@/lib/interface/animebytes";
import { validateSeriesFilter } from "@/lib/util/animebytes";
import { addTorrent } from "./qbittorent";

type qbSettings = {
  qb_url: string;
  qb_port: number;
  qb_username: string;
  qb_password: string;
  qb_pause_torrent: boolean;
  qb_default_label: string;
  qb_scheduler_default_label: string;
};

async function searchAnimeAB(ab_id: number, ab_anime_title: string) {
    const abSettings = await getABSettings();

    const ab_auth = {
        username: abSettings.ab_username,
        passkey: abSettings.ab_key
    } as ABAuth;

    const result = await getAnime(ab_auth, ab_anime_title, ab_id);

    return result;
}

async function isTorrentProcessed(prisma: PrismaClient, torrentId: number) {
    const torrent = await prisma.processedTorrent.findUnique({
        where: { torrent_id: torrentId }
    });

    return torrent ? true : false;
}

export async function startProcessingMissingEpisode() {
    const prisma = new PrismaClient();

    const fetchedEpisode = [];

    const qbSettings = await getQBClientSettings() as qbSettings;
    const series = await getActiveSeries(prisma);

    for (const item of series) {
        console.log(`Processing missing episode for series ${item.series_name}... ${item.ab_id}`);

        const result = await searchAnimeAB(item.ab_id, item.series_name!);

        if (!result) {
            throw new Error(`Series ${item.ab_id} not found on AB.`);
        }

        const seriesFilter = await prisma.animeSchedulerFilter.findMany({where: {scheduler_id: item.id}});

        for (const torrent of result.Torrents) {

            if (await isTorrentProcessed(prisma, torrent.ID)) {
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
            const fileName = torrent.FileList[0].filename;

            await processMissingEpisode(
                qbSettings, 
                item.ab_id, 
                torrent.Link, 
                torrent.ID, 
                fileName,
                prisma
            );

            fetchedEpisode.push(fileName);
        }  
    }

    prisma.$disconnect();

    return fetchedEpisode;
}

export async function processMissingEpisode(
    qbSettings : qbSettings, 
    ab_id: number, 
    downloadLink: string, 
    torrentId: number, 
    series_title: string,
    prisma = new PrismaClient()
  ) {

  console.log(`Missing series ab_id=${ab_id}. Download link: ${downloadLink}`);

  const status = await addTorrent(downloadLink, 
    qbSettings.qb_url || "", 
    qbSettings.qb_port || 0, 
    qbSettings.qb_username || "", 
    qbSettings.qb_password || "", 
    qbSettings.qb_pause_torrent || false, 
    qbSettings.qb_scheduler_default_label || "",
    [series_title],
    addToLog
  );

  if (!status.ok) {
    throw new Error(
        `Failed to add torrent ${torrentId}: ${status.error ?? "Unknown error"}`
    );
  }

  await prisma.processedTorrent.create({
      data: {
          torrent_id: torrentId,
          processedAt: new Date(Date.now())
      }
  });
  
}

async function getActiveSeries(prisma: PrismaClient) {
  return prisma.animeScheduler.findMany({
    where: { soft_deleted: false },
  });
}