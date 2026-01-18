import { addTorrent, healthCheck } from '../lib/api/qbittorent.js';
import { extractEpisodeNo, validateSeriesFilter } from '../lib/util/animebytes.js';
import { decode } from 'entities';
import { PrismaClient } from '@prisma/client';

type AnimeBytesItem = {
  title: string;
  link: string;
  pubDate: string;
  guid: string;
  content: string;
  categories: string[];
  description: string;
  isoDate: string;
  groupId?: string;        // custom field
  groupTitle?: string;     // custom field
  torrentProperty: string; // custom field
  torrentId?: string;       // custom field
  poster_url?: string;      // custom field
};

type qbSettings = {
  qb_url: string;
  qb_port: number;
  qb_username: string;
  qb_password: string;
  qb_pause_torrent: boolean;
  qb_default_label: string;
};

const prisma = new PrismaClient();

export async function getActiveSeries() {
  return prisma.animeScheduler.findMany({
    where: { soft_deleted: false },
  });
}

export async function isQBHealthy(qbSettings : qbSettings): Promise<{ ok: boolean; message: string }> {
  const health = await healthCheck(
    qbSettings.qb_url || "",
    qbSettings.qb_port || 0,
    qbSettings.qb_username || "",
    qbSettings.qb_password || ""
  );
    if (!health.ok) {
      console.error("Skipping RSS fetch: qBittorrent not reachable:", health.message);
      return {
        ok: false,
        message: health.message
      };
    }

    return {
      ok: true,
      message: "Connected to qBittorrent"
    };
  }

export async function updateSeriesScheduler(ab_id: number, item: AnimeBytesItem) {
  function stripHTML(html: string): string {
    const noTags = html.replace(/<[^>]*>/g, "");
    return decode(noTags);
  }

  const seriesToUpdate = await prisma.animeScheduler.update({
    where: { ab_id },
    data: {
      last_fetched_episode: extractEpisodeNo(item.torrentProperty) || 0,
      last_fetched_at: new Date(Date.now())
    }
  });

  await prisma.animeSchedulerReference.updateMany({
    where: { scheduler_id: seriesToUpdate.id },
    data: {
      summary: stripHTML(item.description),
      poster_url: item.poster_url
    }
  });
}

export async function processMatchedLink(qbSettings : qbSettings, ab_id: number, downloadLink: string, torrentId: number, item: AnimeBytesItem) {
  console.log(`Matched ab_id=${ab_id}. Download link: ${downloadLink}`);

  addTorrent(downloadLink, 
    qbSettings.qb_url || "", 
    qbSettings.qb_port || 0, 
    qbSettings.qb_username || "", 
    qbSettings.qb_password || "", 
    qbSettings.qb_pause_torrent || false, 
    qbSettings.qb_default_label || ""
  );

  await prisma.processedTorrent.create({
      data: {
          torrent_id: torrentId,
          processedAt: new Date(Date.now())
      }
  });
  
  await updateSeriesScheduler(ab_id, item);
}

export async function processFeedItem(qbSettings : qbSettings, feed: { items: AnimeBytesItem[] }, seriesList: { ab_id: number, id: number }[]) {
    for (const item of feed.items) {

    const groupId = parseInt(item.groupId ?? '', 10);

    if (!groupId) continue;

    // Match by ab_id
    const matchedSeries = seriesList.find(series => series.ab_id === groupId);
    
    if (matchedSeries && item.link) {
      const torrentId = parseInt(item.torrentId || '0', 10);
      const seriesFilter = await prisma.animeSchedulerFilter.findMany({where: {scheduler_id: matchedSeries.id}});
      
      const isMatchingFilter = validateSeriesFilter(seriesFilter, item.torrentProperty);
      const isTorrentProcessed = await prisma.processedTorrent.findUnique({where: {torrent_id: torrentId}});

      if (isMatchingFilter && !isTorrentProcessed) {
          await processMatchedLink(qbSettings, matchedSeries.ab_id, item.link, torrentId, item);
      }
    }
  }
}