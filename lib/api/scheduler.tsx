"use server";

import { AnimeScheduler, AnimeSchedulerEpisodeReference, AnimeSchedulerFilter, AnimeSchedulerReference, PrismaClient } from "@prisma/client";
import {getFirstStudioOnly} from "../util/animebytes";
import { extractAniDBIDFromLinks, extractMalIDFromLinks, stripHTML } from "../util/util";
import { getAnimeAiringTime, getAnilistID  } from "./anilist";
import { getAnimeAiringData } from "./anizip";

const SCHEDULER_PORT = process.env.SCHEDULER_PORT || 4000;

export async function addToScheduler(anime_data: Anime, filters: Filters) {
    const ab_id = anime_data.ID;
    const series_name = anime_data.SeriesName;

    const anidb_id = extractAniDBIDFromLinks(anime_data.Links);
    const mal_id = extractMalIDFromLinks(anime_data.Links);
    const anilist_id = mal_id ? await getAnilistID(mal_id) : null;

    const prisma = new PrismaClient();

    const existingItem = await prisma.animeScheduler.findUnique({where: {ab_id: ab_id}});

    if (existingItem) {

        await prisma.animeScheduler.update({
            where: { id: existingItem.id },
            data: {
                anidb_id: anidb_id, //ID won't change - This is for existing data before migration that does not have ID
                mal_id: mal_id,
                anilist_id: anilist_id,
                soft_deleted: false
            }
        });

        const airingTime = await getAnimeAiringTime(anilist_id);

        await prisma.animeSchedulerReference.updateMany({
            where: { scheduler_id: existingItem.id },
            data: {
                summary: stripHTML(anime_data.Description), 
                tags: anime_data.Tags.join(", "),
                poster_url: anime_data.Image,
                airing_time: airingTime
            }
        });

        await prisma.animeSchedulerFilter.deleteMany({
            where: { scheduler_id: existingItem.id }
        });

        const filterPromises = Object.entries(filters).flatMap(([category, items]) =>
            Object.entries(items)
                .filter(([, mode]) => mode !== 'neutral') // ignore neutral
                .map(([value, mode]) => 
                prisma.animeSchedulerFilter.create({
                    data: {
                    scheduler_id: existingItem.id,
                    category: category.toUpperCase(), // QUALITY, GROUP, EXTENSION
                    mode: mode === 'include' ? 'ACCEPT' : 'REJECT',
                    value,
                    },
                })
            )
        );

        await Promise.all(filterPromises);
        
        const schedulerRef = await prisma.animeSchedulerReference.findFirst({
            where: { scheduler_id: existingItem.id },
            select: { id: true },
        });

        if (!schedulerRef) return;

        const airingData = anidb_id ? await getAnimeAiringData(anidb_id) : null;

        if (!airingData?.length) return;

        for (const episode of airingData) {
            await prisma.animeSchedulerEpisodeReference.upsert({
                where: {
                    scheduler_ref_id_episode_number: {
                        scheduler_ref_id: schedulerRef.id,
                        episode_number: episode.episode,
                    },
                },
                update: {
                    episode_title: episode.title,
                    episode_date: episode.airdate,
                },
                create: {
                    scheduler_ref_id: schedulerRef.id,
                    episode_number: episode.episode,
                    episode_title: episode.title,
                    episode_date: episode.airdate,
                },
            });
        }


    }
    else {
        const createdItem = await prisma.animeScheduler.create({       
            data: {
                ab_id: ab_id,
                mal_id: mal_id,
                anidb_id: anidb_id,
                anilist_id: anilist_id,
                series_name: series_name.toLowerCase(),
            }  
        });

        const episodes = anidb_id ? await getAnimeAiringData(anidb_id) : null;

        const airingTime = await getAnimeAiringTime(anilist_id);

        const schedulerReference = await prisma.animeSchedulerReference.create({
            data: {
                scheduler_id: createdItem.id,
                series_name: series_name,
                studio_name: getFirstStudioOnly(anime_data.StudioList),
                summary: anime_data.Description,
                tags: anime_data.Tags.join(", "),
                poster_url: anime_data.Image,
                airing_time: airingTime
            }
        });

        await prisma.animeSchedulerEpisodeReference.createMany({
            data: episodes
                ? episodes.map(episode => ({
                    scheduler_ref_id: schedulerReference.id,
                    episode_title: episode.title,
                    episode_number: episode.episode,
                    episode_date: episode.airdate,
                }))
            : [],
        })


        const filterPromises = Object.entries(filters).flatMap(([category, items]) =>
            Object.entries(items)
                .filter(([, mode]) => mode !== 'neutral') // ignore neutral
                .map(([value, mode]) => 
                prisma.animeSchedulerFilter.create({
                    data: {
                    scheduler_id: createdItem.id,
                    category: category.toUpperCase(), // QUALITY, GROUP, EXTENSION
                    mode: mode === 'include' ? 'ACCEPT' : 'REJECT',
                    value,
                    },
                })
                )
            );

        await Promise.all(filterPromises);

    }

    await prisma.$disconnect();
}

export async function getAnimeInScheduler(searchQuery: string | null = null) : 
    Promise<(AnimeScheduler & 
    { 
        references: AnimeSchedulerReference[]; 
        filter: AnimeSchedulerFilter[] 
    } )[]> {
    
    const prisma = new PrismaClient();

    const result = await prisma.animeScheduler.findMany({
        where: {
            'soft_deleted': false,
            ...(searchQuery ? { 'series_name': { contains: searchQuery.toLocaleLowerCase() } } : {})
        },
        include: {
            references: true,
            filter: true
        }
    });

    await prisma.$disconnect();
    
    return result;
}

export async function getUpcomingAnime(searchQuery: string | null = null) : 
    Promise<(AnimeScheduler & 
    { 
        references: 
        {
            series_name: string;
            studio_name: string;
            summary: string;
            tags: string;
            poster_url: string
            episodes: AnimeSchedulerEpisodeReference[]
        }[];
    } )[]> {
    
    const prisma = new PrismaClient();

    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const result = await prisma.animeScheduler.findMany({
        where: {
            soft_deleted: false,
            ...(searchQuery
            ? { series_name: { contains: searchQuery.toLowerCase() } }
            : {}),
        },
        include: {
            references: {
            include: {
                episodes: {
                where: {
                    episode_date: {
                        gte: today, 
                    },
                },
                },
            },
            }
        },
    });

    await prisma.$disconnect();
    
    return result;
}

export async function deleteFromScheduler(id : number) {
    const prisma = new PrismaClient();

    const deletedItem = await prisma.animeScheduler.update({where: {ab_id: id}, data: {soft_deleted: true}});

    await prisma.animeSchedulerFilter.deleteMany({
        where: { scheduler_id: deletedItem.id }
    });
    
    await prisma.$disconnect();
}

export async function schedulerHealthCheck() {
    try {
        const result = await fetch('http://localhost:' + SCHEDULER_PORT + '/status', { method: 'GET' });
        const status = await result.json();

        const paused = status.paused === true || status.paused === "true";
        const ok = status.running && !paused;
        
        return { 
            ok: ok,
            reason: status.paused ? "PAUSED" : undefined
        };
    } catch (error) {
        return { ok: false };
    }
}