import { extractOngoingStatus } from '../lib/util/animebytes.js';
import { getAnimes } from '../lib/api/animebytes.js';
import { AnimeIdMap, PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { getABSettings, getFanartTVSettings } from '../lib/api/settings.js';
import { getFanartTV } from '../lib/api/fanarttv.js';
import { getTVDBData } from '../lib/api/anizip.js';
import { ABAuth, ABGroup, ABSearchQueryParams } from '../lib/interface/animebytes.js';
import {Anime} from '../lib/interface/anime.js';
import { extractAniDBIDFromLinks } from '../lib/util/util.js';

export type FeaturedAnimeBanner = {
  series_url: string;
  title: string;
  banner_url: string;
  logo_url: string;
};

const prisma = new PrismaClient();

const fanarttv_apikey = (await getFanartTVSettings()).fanart_api_key;

export function generateSeriesLink(title : string, id : number) {
    return "/anime/" + encodeURIComponent(title) + "?id=" + id;
}

export async function getTVDBMapping(anidb_id: number): Promise<AnimeIdMap | null> {

    const prisma = new PrismaClient();

    const existing = await prisma.animeIdMap.findFirst({
        where: {
            anidb_id: anidb_id
        }
    });

    if (existing) {
      return existing
    };

    const tvdb_data = await getTVDBData(anidb_id);

    if (!tvdb_data) return null;
    if (!tvdb_data.tvdb_id) return null;

    const title = tvdb_data.title_en!;
    const tvdb_id = tvdb_data.tvdb_id!;
    const season_number = tvdb_data.season_number!;

    return await prisma.animeIdMap.upsert({
      where: {
        anidb_id_tvdb_id_season_number: {
          anidb_id,
          tvdb_id,
          season_number,
        },
      },
      update: {}, // nothing to update
      create: {
        title,
        anidb_id,
        tvdb_id,
        season_number,
      },
    });


}

export async function getAnimeFromAB(search_query : ABSearchQueryParams) : Promise<Anime[] | null> {

    const ab_settings = await getABSettings();

    const ab_auth = {
        passkey: ab_settings.ab_key,
        username: ab_settings.ab_username
    } as ABAuth;

    const searchResult = await getAnimes(ab_auth, search_query);

    const anime_search_result: Anime[] = [];


    searchResult?.map((entry: ABGroup) => {
    anime_search_result.push({
        ID: entry.ID, 
        SeriesName: entry.SeriesName, 
        FullName: entry.FullName,
        Description: entry.Description, 
        Image: entry.Image,
        Type: entry.GroupName,
        Aired: entry.Year,
        Ongoing: extractOngoingStatus(entry.Torrents[0].Property ?? ""),
        Links:  Object.values(entry.Links)
    } as Anime);
    });

    return anime_search_result;
}


export async function getRandomAnime(): Promise<Anime[] | null> {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randChar = chars[Math.floor(Math.random() * chars.length)];

  const sorts = ["relevance", "name", "rating", "votes"];
  const ways = ["asc", "desc"];

  const randSort = sorts[Math.floor(Math.random() * sorts.length)];
  const randWay = ways[Math.floor(Math.random() * ways.length)];


  const AB_SearchQuery = {
    title: randChar,
    type: "TV_SERIES",
    maxItem: 13,
    hentai: 0,
    airing: 2,
    sort: randSort,
    way: randWay
  } as ABSearchQueryParams;

  const anime_search_result = await getAnimeFromAB(AB_SearchQuery);

  return anime_search_result;
}


/**
 * Fetch anime, insert into AnimeResource, create HomepageHero and HomepageItem.
 */
async function populateHomepageHero(heroType: string, heroNumber: number = 1): Promise<FeaturedAnimeBanner[]> {

  const animeList = await getRandomAnime();

  if (!animeList || animeList.length === 0) return [];

  const hero = await prisma.homepageHero.create({
      data: { 
        type: heroType, 
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
 * Schedule via cron: run every day at 2 AM
 */
cron.schedule('0 2 * * *', async () => {
  console.log('Running homepage hero fetcher...');
  try {
    await populateHomepageHero('featured', 1);
  } catch (err) {
    console.error('Error in homepage hero fetcher:', err);
  }
});


populateHomepageHero('featured', 1)
    .then((result) => console.log('Initial run complete:', result.length, 'items'))
    .finally(async () => await prisma.$disconnect());

