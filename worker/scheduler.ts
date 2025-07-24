import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import Parser from 'rss-parser';
import { addTorrent } from '../lib/api/qbittorent.js';
import {extractEpisodeNo, validateSeriesFilter} from '../lib/util/animebytes.js';

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

const parser = new Parser<{}, AnimeBytesItem>({
  customFields: {
    item: [
      ['description', 'description'],
      ['ab:groupId', 'groupId'],
      ['ab:groupTitle', 'groupTitle'],
      ['ab:torrentProperty', 'torrentProperty'],
      ['ab:torrentId', 'torrentId'],
      ['ab:cover', 'poster_url']
    ]
  }
});

const AB_PASSKEY = process.env.AB_PASSKEY;
const DEV_MODE = process.env.DEV_MODE === "true" ? true : false;
const prisma = new PrismaClient();
const RSS_FEED_URL = 'https://animebytes.tv/feed/rss_torrents_airing_anime/' + AB_PASSKEY; 

async function processMatchedLink(ab_id: number, downloadLink: string, torrentId: number, item: AnimeBytesItem) {
  console.log(`Matched ab_id=${ab_id}. Download link: ${downloadLink}`);

  addTorrent(downloadLink);

  await prisma.processedTorrent.create({
      data: {
          torrent_id: torrentId,
          processedAt: new Date(Date.now())
      }
  });
  
  await updateSeriesScheduler(ab_id, item);
}

async function updateSeriesScheduler(ab_id: number, item: AnimeBytesItem) {
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
      summary: item.description,
      poster_url: item.poster_url
    }
  })
}

async function fetchAndProcessRSS() {
  console.log('Fetching RSS feed...');

  const seriesList = await prisma.animeScheduler.findMany({where: {soft_deleted: false}});
  const feed = await parser.parseURL(RSS_FEED_URL);

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
          await processMatchedLink(matchedSeries.ab_id, item.link, torrentId, item);
      }
    }
  }

  console.log('RSS processing completed.');
}

if (DEV_MODE) {
  fetchAndProcessRSS().catch(console.error);

  console.log('AnimeBytes RSS watcher exited in Dev Mode.');
  process.exit(0);
}

// Run every 5 minutes
cron.schedule('*/5 * * * *', () => {
  fetchAndProcessRSS().catch(console.error);
});

console.log('AnimeBytes RSS watcher started.');
