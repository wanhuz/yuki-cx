import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { getAnimeAiringData } from '../lib/api/anizip.js';

const prisma = new PrismaClient();

async function updateSeriesUpcomingEpisodes() {
  const seriesToUpdate = await prisma.animeScheduler.findMany({
    where: { soft_deleted: false },
    include: { references: true },
  });

  for (const series of seriesToUpdate) {
    if (!series.anidb_id) continue;
    if (!series.references.length) continue;

    const airingData = await getAnimeAiringData(series.anidb_id);
    if (!airingData?.length) continue;

    const scheduler_ref_id = series.references[0].scheduler_id;

    for (const episode of airingData) {
      await prisma.animeSchedulerEpisodeReference.upsert({
        where: {
          scheduler_ref_id_episode_number: {
            scheduler_ref_id,
            episode_number: episode.episode,
          },
        },
        update: {
          episode_title: episode.title,
          episode_date: episode.airdate,
        },
        create: {
          scheduler_ref_id,
          episode_number: episode.episode,
          episode_title: episode.title,
          episode_date: episode.airdate,
        },
      });
    }
  }
}

// Run every 6 hours
cron.schedule('0 */6 * * *', async () => {
    console.log('Updating series upcoming episodes...');

    try {
        await updateSeriesUpcomingEpisodes();
    } catch (error) {
        console.error('Update series upcoming episodes error:', error);
    }

    console.log('Series upcoming episodes updated.');
});
