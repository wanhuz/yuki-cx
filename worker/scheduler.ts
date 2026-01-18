import http from 'http';
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { getABSettings, getQBClientSettings } from '../lib/api/settings.js';
import { getActiveSeries, isQBHealthy, processFeedItem } from '../worker/scheduler-helper.js';
import Parser from 'rss-parser';

type qbSettings = {
  qb_url: string;
  qb_port: number;
  qb_username: string;
  qb_password: string;
  qb_pause_torrent: boolean;
  qb_default_label: string;
};

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

const prisma = new PrismaClient();
const abSettings = await getABSettings();

const AB_PASSKEY = abSettings.ab_key;
const DEV_MODE = process.env.DEV_MODE === "true" ? true : false;
const SCHEDULER_PORT = process.env.SCHEDULER_PORT ? process.env.SCHEDULER_PORT : 4000;
const RSS_FEED_URL = 'https://animebytes.tv/feed/rss_torrents_airing_anime/' + AB_PASSKEY; 

async function fetchAndProcessRSS() {
  const qbSettings = await getQBClientSettings() as qbSettings;

  console.log('Fetching RSS feed...');

  let feed;

  try {
    feed = await parser.parseURL(RSS_FEED_URL);
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    return;
  }

  if (!feed) {
    console.error('Error parsing RSS feed: No items found.');
    return;
  }

  const health = await isQBHealthy(qbSettings);

  if (!health.ok) {
    console.error('Skipping Processing RSS: qBittorrent not reachable:', health.message);
    return;
  }

  const seriesList = await getActiveSeries();

  processFeedItem(qbSettings, feed, seriesList);

  console.log('RSS processing completed.');
}

async function isSchedulerPaused(): Promise<boolean> {
  const setting = await prisma.settings.findFirst({
    where: { key: "yuki_scheduler_paused" },
  });

  return setting?.value === "true";
}

if (DEV_MODE) {
  await fetchAndProcessRSS().catch(console.error);

  console.log('AnimeBytes RSS watcher exited in Dev Mode.');
  process.exit(0);
}

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Starting cron job...');

  try {
    if (await isSchedulerPaused()) {
      console.log("Scheduler is paused. Skipping run.");
      return;
    }

    await fetchAndProcessRSS();
  } catch (error) {
    console.error('Error processing RSS feed:', error);
  }

  console.log('End of cron job');
});


console.log('AnimeBytes RSS watcher started.');

http.createServer(async (req, res) => {
  if (req.url === '/status') {
    const paused = await isSchedulerPaused();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      running: true,
      paused
    }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
}).listen(SCHEDULER_PORT, () => {
  console.log(
    'Scheduler status API running on http://localhost:' +
    SCHEDULER_PORT +
    '/status'
  );
});