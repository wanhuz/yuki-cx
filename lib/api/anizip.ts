"use server";

import { AniZipEpisode, AniZipSeries, AniZipTVDBData } from "./anizip.types";

async function getAnimeInformation(anidb_id: number): Promise<AniZipSeries | null> {
    try {
        const response = await fetch(`https://api.ani.zip/mappings?anidb_id=${anidb_id}`);

        const data : AniZipSeries = await response.json();

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



export async function getTVDBData(anidb_id: number): Promise<AniZipTVDBData | null > {

    const data = await getAnimeInformation(anidb_id);

    if (!data) return null;

    const tvdb_id = data?.mappings.thetvdb_id || null;
    const season_number = data?.episodes[0].seasonNumber || null;
    const title_en = data?.titles.en || null;

    const tvdb_data = { tvdb_id, season_number, title_en } as AniZipTVDBData;

    return tvdb_data;
}