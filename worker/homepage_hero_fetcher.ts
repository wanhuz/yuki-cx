
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { getFanartTVSettings } from '../lib/api/settings.js';
import { getFanartTV } from '../lib/api/fanarttv.js';
import { extractAniDBIDFromLinks } from '../lib/util/util.js';
import { generateSeriesLink, getAnimeHero, getTVDBMapping } from './homepage_hero_helper.js';
import { HeroType } from '../lib/enum/hero.js';
import { FeaturedAnimeBanner } from '../lib/interface/animebanner.js';

const heroTypeValues = Object.values(HeroType).filter(
  (v) => typeof v === "number"
) as number[];

let roundRobinIndex = 1;

function getNextHeroType(): HeroType {
  const type = heroTypeValues[roundRobinIndex];
  roundRobinIndex = (roundRobinIndex + 1) % heroTypeValues.length;
  return type as HeroType;
}

const prisma = new PrismaClient();
const fanarttv_apikey = (await getFanartTVSettings()).fanart_api_key;

async function populateHomepageHero(heroType: HeroType, heroNumber: number = 1): Promise<FeaturedAnimeBanner[] | null> {

    const animeList = await getAnimeHero(heroType);

    if (!animeList || animeList.length === 0) return [];

    if (heroType === HeroType.Seasonal) { // Only one seasonal hero
        const seasonalHero = await prisma.homepageHero.findFirst({ where: { type: HeroType[heroType] } });

        if (seasonalHero && (new Date().getTime() - seasonalHero.created_at.getTime()) / (1000 * 60 * 60 * 24) < 1) return null;

        await prisma.homepageHero.deleteMany({ where: { type: HeroType[heroType] } });
    }

    const hero = await prisma.homepageHero.create({
        data: { 
            type: HeroType[heroType], 
            number: heroNumber, 
            created_at: new Date() 
        }
    });

    const enrichedAnime = await Promise.all(
        animeList.map(async (anime: { Links: any; ID: any; SeriesName: any; }): Promise<FeaturedAnimeBanner | null> => {
            const anidb_id = extractAniDBIDFromLinks(anime.Links);
            if (!anidb_id) return null;

            let animeResource = await prisma.animeResource.findFirst({ where: { anidb_id } });

            const tvdb_map = await getTVDBMapping(anidb_id);

            if (!tvdb_map) return null;

            const banner = await getFanartTV(fanarttv_apikey!, tvdb_map.tvdb_id);

            if (!banner?.hdtvlogo || !banner?.seasonposter) return null;

            const ab_id = anime.ID;
            const ab_title = anime.SeriesName;

            if (!animeResource) {
                animeResource = await prisma.animeResource.create({
                    data: {
                    ab_id: ab_id,
                    ab_title: ab_title,
                    anidb_id,
                    banner_url: banner.seasonposter.url,
                    logo_url: banner.hdtvlogo.url
                    }
                });
            }

            await prisma.homepageItem.create({
                data: {
                    heroId: hero!.id,
                    animeResourceId: animeResource.id,
                    created_at: new Date()
                }
            });

            return {
                series_url: generateSeriesLink(animeResource.ab_title, animeResource.ab_id),
                title: animeResource.ab_title,
                banner_url: animeResource.banner_url,
                logo_url: animeResource.logo_url
            };
        })
    );

  return enrichedAnime.filter((item): item is FeaturedAnimeBanner => item !== null);
}

/**
 * Schedule via cron: run every 2 hours
 */
cron.schedule('0 */2 * * *', async () => {
  console.log('Running homepage hero fetcher...');
  try {
    const heroType = getNextHeroType();

    console.log('Fetching homepage for ', HeroType[heroType]);

    await populateHomepageHero(heroType, 1).then((result) => console.log('Run complete:', result?.length ?? 0, 'items'));
  } catch (err) {
    console.error('Error in homepage hero fetcher:', err);
  }
});

populateHomepageHero(heroTypeValues[0], 1)
    .then((result) => console.log('Initial run complete:', result?.length ?? 0, 'items'))
    .finally(async () => await prisma.$disconnect());

