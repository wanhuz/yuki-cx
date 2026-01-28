"use server";

import { PrismaClient } from "@prisma/client";

type AniZipEpisode = {
  episode: string | number;
  episodeNumber?: number;
  seasonNumber?: number;

  airdate?: string;
  airDateUtc?: string;

  title?: {
    en?: string;
    [lang: string]: string | undefined;
  };
};

async function getAnimeInformation(anidb_id: number) {
    try {
        const response = await fetch(`https://api.ani.zip/mappings?anidb_id=${anidb_id}`);

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getAnimeAiringData(
    anidb_id: number
): Promise<{ title: string; episode: number; airdate: Date }[] | null> {
    const data = await getAnimeInformation(anidb_id);

    if (!data?.episodes) return null;

    const now = new Date();

    const futureEpisodes = Object.values(data.episodes as Record<string, AniZipEpisode>)
        .filter(ep => ep.airdate)
        .map(ep => ({
            title: ep.title?.en ?? "",
            episode: Number(ep.episode),
            airdate: ep.airDateUtc
                ? new Date(ep.airDateUtc)
                : new Date(`${ep.airdate}T00:00:00Z`), // fallback only
        }))
        .filter(ep => ep.airdate > now)
        .sort((a, b) => a.airdate.getTime() - b.airdate.getTime());

    return futureEpisodes.length > 0 ? futureEpisodes : null;
}

export async function getTVDBId(anidb_id: number) {

    const prisma = new PrismaClient();

    const existing = await prisma.animeIdMap.findFirst({
        where: {
            anidb_id
        }
    });

    if (existing) return existing.tvdb_id;

    const data = await getAnimeInformation(anidb_id);

    const tvdb_id = data.mappings.thetvdb_id;



    const episodes = Object.values(data.episodes) as AniZipEpisode[];

    const season_number = episodes.find( e => typeof e.episodeNumber === "number")?.seasonNumber;

    if (!season_number) return null;

    const title = data.titles.en;

    await prisma.animeIdMap.create({
        data: {
            title,
            anidb_id,
            tvdb_id,
            season_number
        }
    });

    await prisma.$disconnect();

    return data.mappings.tvdb_id;
}