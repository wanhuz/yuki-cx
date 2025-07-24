"use server";

import { AnimeScheduler, AnimeSchedulerFilter, AnimeSchedulerReference, PrismaClient } from "@prisma/client";
import {getFirstStudioOnly} from "../util/animebytes";
import { stripHTML } from "../util/util";



export async function addToScheduler(anime_data: Anime, filters: Filters) {
    const ab_id = anime_data.ID;
    const series_name = anime_data.SeriesName;

    const prisma = new PrismaClient();

    const existingItem = await prisma.animeScheduler.findUnique({where: {ab_id: ab_id}});

    if (existingItem) {

        await prisma.animeScheduler.update({
            where: { id: existingItem.id },
            data: {
                soft_deleted: false
            }
        });

        await prisma.animeSchedulerReference.updateMany({
            where: { scheduler_id: existingItem.id },
            data: {
                summary: stripHTML(anime_data.Description), 
                tags: anime_data.Tags.join(", "),
                poster_url: anime_data.Image
            }
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

    }
    else {
        const createdItem = await prisma.animeScheduler.create({       
            data: {
                ab_id: ab_id,
                series_name: series_name.toLowerCase(),
            }  
        });

        await prisma.animeSchedulerReference.create({
            data: {
                scheduler_id: createdItem.id,
                series_name: series_name,
                studio_name: getFirstStudioOnly(anime_data.StudioList),
                summary: anime_data.Description,
                tags: anime_data.Tags.join(", "),
                poster_url: anime_data.Image
            }
        });

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

export async function deleteFromScheduler(id : number) {
    const prisma = new PrismaClient();

    const deletedItem = await prisma.animeScheduler.update({where: {ab_id: id}, data: {soft_deleted: true}});

    await prisma.animeSchedulerFilter.deleteMany({
        where: { scheduler_id: deletedItem.id }
    });
    
    await prisma.$disconnect();
}