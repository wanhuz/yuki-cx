import { AnimeIdMap, AnimeResource, PrismaClient } from "@prisma/client";
import { getAnimes } from "../api/animebytes"
import { getTVDBData } from "../api/anizip";
import { getFanartTV } from "../api/fanarttv";
import { extractAniDBIDFromLinks, normalizeDictToArray } from "../util/util";

export type FeaturedAnimeBanner = {
    series_url: string;
    title: string;
    banner_url: string;
    logo_url: string;
}

export async function getFeaturedAnime(): Promise<FeaturedAnimeBanner[]> {

  const AB_SearchQuery = {
    title: "",
    type: "TV_SERIES",
    maxItem: 10,
    hentai: 0,
    sort: "votes",
    way: "desc",
    airing: 1,
    epcount: 1,
    epcount2: 26
  };

  const prisma = new PrismaClient();
  const anime = await getAnimes(AB_SearchQuery);

  let enrichedAnime = await Promise.all(
    anime.map(async (result: { Links: object; }) => {
      const links = normalizeDictToArray(result.Links);
      const anidb_id = extractAniDBIDFromLinks(links);

      if (!anidb_id) {
        return result;
      }

      // Check cache
      const existing = await prisma.animeResource.findFirst({
        where: { anidb_id }
      });

      if (existing) {
        return {
          series_url: existing.anidb_id.toString(),
          title: existing.anidb_id.toString(),
          banner_url: existing.banner_url,
          logo_url: existing.logo_url
        } as FeaturedAnimeBanner;
      }

      const tvdb_map = await getTVDBMapping(anidb_id);

      if (!tvdb_map) return result;

      const banner = await getFanartTV(tvdb_map.tvdb_id);

      if (!banner?.hdtvlogo || !banner?.seasonposter) return result;

      // persist
      await prisma.animeResource.create({
        data: {
          anidb_id,
          banner_url: banner.seasonposter.url,
          logo_url: banner.hdtvlogo.url
        }
      });

      // return enriched object
      return {
        series_url: anidb_id.toString(),
        title: anidb_id.toString(),
        banner_url: banner.seasonposter.url,
        logo_url: banner.hdtvlogo.url
      };
    })
  );

  enrichedAnime = enrichedAnime.filter(
    (item: FeaturedAnimeBanner) => item.banner_url && item.logo_url
  )

  await prisma.$disconnect();

  return enrichedAnime;
}

export async function getAnimeBanner(anidb_id : number) {
    
}

export async function getTVDBMapping(anidb_id: number): Promise<AnimeIdMap | null> {

    const prisma = new PrismaClient();

    const existing = await prisma.animeIdMap.findFirst({
        where: {
            anidb_id
        }
    });

    if (existing) {
      await prisma.$disconnect();
    
      return existing
    };

    const tvdb_data = await getTVDBData(anidb_id);

    if (!tvdb_data) return null;

    const title = tvdb_data.title_en!;
    const tvdb_id = tvdb_data.tvdb_id!;
    const season_number = tvdb_data.season_number!;

    await prisma.animeIdMap.create({
        data: {
            title,
            anidb_id,
            tvdb_id,
            season_number
        }
    });

    const item = await prisma.animeIdMap.findFirst({
        where: {
            anidb_id
        }
    });

    await prisma.$disconnect();

    return item;
}