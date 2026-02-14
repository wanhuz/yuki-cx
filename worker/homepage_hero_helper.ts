import { extractOngoingStatus } from '../lib/util/animebytes.js';
import { getAnimes } from '../lib/api/animebytes.js';
import { AnimeIdMap, PrismaClient } from '@prisma/client';
import { getABSettings, getFanartTVSettings } from '../lib/api/settings.js';
import { getTVDBData } from '../lib/api/anizip.js';
import { ABAuth, ABGroup, ABSearchQueryParams } from '../lib/interface/animebytes.js';
import {Anime} from '../lib/interface/anime.js';


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

export async function getSeasonalAnime(): Promise<Anime[] | null> {

  const AB_SearchQuery_Seasonal = {
      title: "",
      type: "TV_SERIES",
      maxItem: 15,
      hentai: 0,
      airing: 1,
      sort: "relevance",
      way: "desc",
      epcount: 1,
      epcount2: 26
  };

  const anime_search_result = await getAnimeFromAB(AB_SearchQuery_Seasonal);

  return anime_search_result;
}


export async function getAnimeHero(type: number):  Promise<Anime[] | null> {

  switch (type) {
    case 0:
      return await getSeasonalAnime();
    case 1:
      return await getAnimeByGenre();
    case 2:
      return await getAnimeByYear();
    case 3:
      return await getYouMightLike();
    case 4:
      return await getRandomAnime();
    default:
      return null;
  }

}

async function getAnimeByGenre(): Promise<Anime[] | null> {

  const AB_SearchQuery_Seasonal = {
      title: "",
      type: "TV_SERIES",
      maxItem: 15,
      hentai: 0,
      airing: 1,
      sort: "relevance",
      way: "desc",
      epcount: 1,
      epcount2: 26
  };

  const anime_search_result = await getAnimeFromAB(AB_SearchQuery_Seasonal);

  return anime_search_result;
}

async function getAnimeByYear(): Promise<Anime[] | null> {
  const currentYear = new Date().getFullYear();
  const year = Math.floor(Math.random() * (currentYear - 2000 + 1)) + 2000;

  const AB_SearchQuery_Seasonal = {
      title: "",
      type: "TV_SERIES",
      maxItem: 15,
      hentai: 0,
      airing: 0,
      sort: "relevance",
      way: "desc",
      year: year
  };

  const anime_search_result = await getAnimeFromAB(AB_SearchQuery_Seasonal);

  return anime_search_result;
}

export async function getYouMightLike(): Promise<Anime[] | null> {

  const AB_SearchQuery_YouMightLike = {
    title: "",
    type: "DEFAULT",
    maxItem: 15,
    hentai: 0,
    sort: "votes",
    way: "desc"
  };

  const anime_search_result = await getAnimeFromAB(AB_SearchQuery_YouMightLike);

  return anime_search_result;
}