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
};

const parser = new Parser<{}, AnimeBytesItem>({
  customFields: {
    item: [
      ['ab:groupId', 'groupId'],
      ['ab:groupTitle', 'groupTitle'],
      ['ab:torrentProperty', 'torrentProperty']
    ]
  }
});

const prisma = new PrismaClient();
const RSS_FEED_URL = 'https://animebytes.tv/feed/rss_torrents_airing_anime/';  // Do not hardcode token

async function processMatchedLink(ab_id: number, downloadLink: string) {
  console.log(`Matched ab_id=${ab_id}. Download link: ${downloadLink}`);
  addTorrent(downloadLink);
}

async function fetchAndProcessRSS() {
  console.log('Fetching RSS feed...');

  const seriesList = await prisma.animeScheduler.findMany();
  const feed = await parser.parseURL(RSS_FEED_URL);

  console.log('Series to be matched:');
  for (const series of seriesList) {
    console.log(`  ab_id=${series.ab_id}`);
  }

  console.log(`Fetched ${feed.items.length} RSS items.`);

  for (const item of feed.items) {
    console.log(item.groupId);       // This will now output ab:groupId
    console.log(item.groupTitle);    // This will now output ab:groupTitle

    const groupId = parseInt(item.groupId ?? '', 10);

    //console.log(`Processing RSS item with ab:groupId=${groupIdStr}`);
    if (!groupId) continue;

    // Match by ab_id
    const matchedSeries = seriesList.find(series => series.ab_id === groupId);

    if (matchedSeries && item.link) {
      await processMatchedLink(matchedSeries.ab_id, item.link);
    }
  }

  console.log('RSS processing completed.');
}

// Run every 5 minutes
//cron.schedule('*/5 * * * *', () => {
  fetchAndProcessRSS().catch(console.error);
//});

console.log('AnimeBytes RSS watcher started.');
