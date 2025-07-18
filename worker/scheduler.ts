import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import Parser from 'rss-parser';
import { addTorrent } from '../lib/api/qbittorent';

type AnimeBytesItem = {
  title: string;
  link: string;
  pubDate: string;
  guid: string;
  content: string;
  categories: string[];
  isoDate: string;
  groupId?: string;        // custom field
  groupTitle?: string;     // custom field
  torrentProperty?: string; // custom field
  torrentId?: string;       // custom field
};

const parser = new Parser<{}, AnimeBytesItem>({
  customFields: {
    item: [
      ['ab:groupId', 'groupId'],
      ['ab:groupTitle', 'groupTitle'],
      ['ab:torrentProperty', 'torrentProperty'],
      ['ab:torrentId', 'torrentId'],
    ]
  }
});

const prisma = new PrismaClient();
const RSS_FEED_URL = 'https://animebytes.tv/feed/rss_torrents_airing_anime/';  // Do not hardcode token

async function processMatchedLink(ab_id: number, downloadLink: string, torrentId: number) {
  console.log(`Matched ab_id=${ab_id}. Download link: ${downloadLink}`);

  const existing = await prisma.processedTorrent.findUnique({
    where: { torrent_id: torrentId }  // ab:torrentId from RSS
  });

  if (existing) {
      console.log(`Torrent ${torrentId} already processed, skipping.`);
      return;  // Already processed
  }

  addTorrent(downloadLink);

  await prisma.processedTorrent.create({
      data: {
          torrent_id: torrentId
      }
  });
}

async function fetchAndProcessRSS() {
  console.log('Fetching RSS feed...');

  const seriesList = await prisma.animeScheduler.findMany();
  const feed = await parser.parseURL(RSS_FEED_URL);

  for (const item of feed.items) {

    const groupId = parseInt(item.groupId ?? '', 10);

    //console.log(`Processing RSS item with ab:groupId=${groupIdStr}`);
    if (!groupId) continue;

    // Match by ab_id
    const matchedSeries = seriesList.find(series => series.ab_id === groupId);

    if (matchedSeries && item.link) {
      const torrentId = parseInt(item.torrentId || '0', 10);

      await processMatchedLink(matchedSeries.ab_id, item.link, torrentId);
    }
  }

  console.log('RSS processing completed.');
}

// Run every 5 minutes
cron.schedule('*/5 * * * *', () => {
  fetchAndProcessRSS().catch(console.error);
});

console.log('AnimeBytes RSS watcher started.');
