import { PrismaClient } from "@prisma/client";
import { getAnimes } from "../api/animebytes"
import { getTVDBId } from "../api/anizip";
import { getFanartTV } from "../api/fanarttv";
import { extractAniDBIDFromLinks, normalizeDictToArray } from "../util/util";

export async function getFeaturedAnime() {
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



  const enrichedAnime = await Promise.all(
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
          ...result,
          banner_url: existing.banner_url,
          logo_url: existing.logo_url
        };
      }

      const tvdb_id = await getTVDBId(anidb_id);
      if (!tvdb_id) return result;

      const banner = await getFanartTV(tvdb_id);
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
        ...result,
        banner_url: banner.seasonposter.url,
        logo_url: banner.hdtvlogo.url
      };
    })
  );

  await prisma.$disconnect();

  return enrichedAnime;
}

export async function getAnimeBanner(anidb_id : number) {
    
}