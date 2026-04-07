export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";
import { getAnimes } from "../api/animebytes"
import { generateSeriesLink } from "./series";
import { ABAuth, ABGroup, ABSearchQueryParams } from "../interface/animebytes";
import { extractOngoingStatus } from "../util/animebytes";
import { Anime } from "../interface/anime";
import { getABSettings } from "../api/settings";
import {getNextHeroType} from "./home-helper";
import { HeroType } from "../enum/hero";
import { FeaturedAnimeBanner } from "../interface/animebanner";

export async function getFeaturedAnime(): Promise<FeaturedAnimeBanner[]> {
  const prisma = new PrismaClient();

  const heroType = getNextHeroType();

  const typeName = HeroType[heroType];

  const count = await prisma.homepageHero.count({
    where: { type: typeName }
  });

  if (count === 0) return [];

  const hero = await prisma.homepageHero.findFirst({
    where: { type: typeName },
    skip: Math.floor(Math.random() * count),
    include: {
      homepageItems: {
        include: { animeResource: true }
      }
    }
  });


  if (!hero) return [];

  if (!hero.homepageItems.length) return [];

  // shuffle items (Fisher-Yates)
  const items = [...hero.homepageItems];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items
    .map(item => {
      const anime = item.animeResource;
      if (!anime?.banner_url || !anime?.logo_url) return null;

      return {
        series_url: generateSeriesLink(anime.ab_title, anime.ab_id),
        title: anime.ab_title,
        banner_url: anime.banner_url,
        logo_url: anime.logo_url
      };
    })
    .filter((x): x is FeaturedAnimeBanner => x !== null);
}

export async function getAnimeFromAB(search_query : ABSearchQueryParams) : Promise<Anime[] | null> {

    const ab_settings = await getABSettings();

    const ab_auth = {
        username: ab_settings.ab_username,
        passkey: ab_settings.ab_key
    } as ABAuth;
  

  const searchResult = await getAnimes(ab_auth, search_query, true);

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

export async function getSeasonalAnime(): Promise<Anime[] | null> {

  const AB_SearchQuery_Seasonal = {
      title: "",
      type: "TV_SERIES",
      maxItem: 15,
      hentai: 0,
      airing: 1,
      sort: "relevance",
      way: "desc"
  };

  const anime_search_result = await getAnimeFromAB(AB_SearchQuery_Seasonal);

  return anime_search_result;
}

export async function getTrendingAnimeThisYear(): Promise<Anime[] | null> {

  const current_year = new Date().getFullYear();

  const AB_SearchQuery_TrendingYear = {
    title: "",
    type: "TV_SERIES",
    maxItem: 15,
    hentai: 0,
    sort: "votes",
    way: "desc",
    year: current_year,
  };

  const anime_search_result = await getAnimeFromAB(AB_SearchQuery_TrendingYear);

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

export async function getNewMovieRelease(): Promise<Anime[] | null> {

  const AB_SearchQuery_YouMightLike = {
    title: "",
    type: "MOVIE",
    maxItem: 15,
    hentai: 0,
    sort: "year",
    way: "desc"
  };

  const anime_search_result = await getAnimeFromAB(AB_SearchQuery_YouMightLike);

  
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