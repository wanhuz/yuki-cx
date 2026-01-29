import { AnimeIdMap, PrismaClient } from "@prisma/client";
import { getAnimes } from "../api/animebytes"
import { getTVDBData } from "../api/anizip";
import { getFanartTV } from "../api/fanarttv";
import { extractAniDBIDFromLinks, normalizeDictToArray } from "../util/util";
import { generateSeriesLink } from "./series";
import { ABGroup } from "../interface/animebytes";

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
    maxItem: 20,
    hentai: 0,
    sort: "votes",
    way: "asc"
  };

  const prisma = new PrismaClient();
  const anime = await getAnimes(AB_SearchQuery);

  let enrichedAnime = await Promise.all(
    anime.map(async (result:  ABGroup ): Promise<FeaturedAnimeBanner | null> => {
      const links = normalizeDictToArray(result.Links);
      const anidb_id = extractAniDBIDFromLinks(links);

      if (!anidb_id) {
        return null;
      }

      // Check cache
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

      const banner = await getFanartTV(tvdb_map.tvdb_id, tvdb_map.season_number);

      if (!banner?.hdtvlogo || !banner?.seasonposter) return null;

      const ab_id = result.ID;
      const ab_title = result.SeriesName;

      // persist
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

      // return enriched object
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