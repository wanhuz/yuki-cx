import { AnimeIdMap, PrismaClient } from "@prisma/client";
import { getAnimes } from "../api/animebytes"
import { getTVDBData } from "../api/anizip";
import { getFanartTV } from "../api/fanarttv";
import { extractAniDBIDFromLinks } from "../util/util";
import { generateSeriesLink } from "./series";
import { ABGroup, ABSearchQueryParams } from "../interface/animebytes";
import { extractOngoingStatus } from "../util/animebytes";

export type FeaturedAnimeBanner = {
    series_url: string;
    title: string;
    banner_url: string;
    logo_url: string;
}

export async function getFeaturedAnime(): Promise<FeaturedAnimeBanner[]> {
  const isSeason = Math.random() < 0.3;

  const prisma = new PrismaClient();
  const anime = isSeason? await getSeasonalAnime() : await getRandomAnime();

  if (!anime) {
    return [];
  }

  const enrichedAnime = await Promise.all(
    anime.map(async (result:  Anime ): Promise<FeaturedAnimeBanner | null> => {
      const links = result.Links;
      const anidb_id = extractAniDBIDFromLinks(links);

      if (!anidb_id) {
        return null;
      }

      const existing = await prisma.animeResource.findFirst({
        where: { anidb_id }
      });

      if (existing) {
        const series_link = generateSeriesLink(existing.ab_title, existing.ab_id)

        return {
          series_url: series_link,
          title: existing.ab_title,
          banner_url: existing.banner_url,
          logo_url: existing.logo_url
        } as FeaturedAnimeBanner;
      }


      const tvdb_map = await getTVDBMapping(anidb_id);

      if (!tvdb_map) return null;

      const banner = await getFanartTV(tvdb_map.tvdb_id);

      if (!banner?.hdtvlogo || !banner?.seasonposter) return null;

      const ab_id = result.ID;
      const ab_title = result.SeriesName;

      await prisma.animeResource.create({
        data: {
          ab_id,
          ab_title,
          anidb_id,
          banner_url: banner.seasonposter.url,
          logo_url: banner.hdtvlogo.url
        }
      });

      const series_link = generateSeriesLink(ab_title, ab_id)

      return {
        series_url: series_link,
        title: ab_title,
        banner_url: banner.seasonposter.url,
        logo_url: banner.hdtvlogo.url
      } as FeaturedAnimeBanner;
    })
  );

  const featuredAnime: FeaturedAnimeBanner[] = enrichedAnime.filter(
    (item): item is FeaturedAnimeBanner => item !== null
  );

  const featuredAnimes: FeaturedAnimeBanner[] = featuredAnime.filter(
    (item: FeaturedAnimeBanner) => item.banner_url && item.logo_url
  )

  return featuredAnimes;
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

  const searchResult = await getAnimes(search_query);

  const anime_search_result: Anime[] = [];


  searchResult.map((entry: ABGroup) => {
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
      maxItem: 25,
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

export async function getTrendingAnimeThisYear(): Promise<Anime[] | null> {

  const current_year = new Date().getFullYear();

  const AB_SearchQuery_TrendingYear = {
    title: "",
    type: "TV_SERIES",
    maxItem: 25,
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
    maxItem: 25,
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
    maxItem: 25,
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