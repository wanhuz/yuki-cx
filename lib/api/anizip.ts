"use server";

async function getAnimeInformation(anidb_id: number) {
    const response = await fetch(`https://api.ani.zip/mappings?anidb_id=${anidb_id}`);

    const data = await response.json();

    return data;
}

export async function getAnimeAiringData(
    anidb_id: number
): Promise<{ title: string, episode: number; airdate: Date }[] | null> {
    const data = await getAnimeInformation(anidb_id);

    if (!data?.episodes) return null;

    const now = new Date();

    const futureEpisodes = Object.values(data.episodes)
        .filter((ep: any) => ep.airdate) 
        .map((ep: any) => ({
            title: ep.title.en,
            episode: Number(ep.episode), 
            airdate: new Date(ep.airdate + "T00:00:00Z"),
        }))
        .filter(ep => ep.airdate > now) 
        .sort((a, b) => a.airdate.getTime() - b.airdate.getTime()); 

    return futureEpisodes.length > 0 ? futureEpisodes : null;
}