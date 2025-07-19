"use server";

import { PrismaClient } from "@prisma/client";

export async function addToScheduler(anime_data : Anime) {
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

        const animeSchedulerReference = await prisma.animeSchedulerReference.updateMany({
            where: { scheduler_id: existingItem.id },
            data: {
                series_name: series_name,
                studio_name: anime_data.StudioList,
                summary: anime_data.Description,
                tags: anime_data.Tags.join(", "),
                poster_url: anime_data.Image
            }
        });
    }
    else {
        const createdItem = await prisma.animeScheduler.create({       
            data: {
                ab_id: ab_id,
                series_name: series_name
            }  
        });

        await prisma.animeSchedulerReference.create({
            data: {
                scheduler_id: createdItem.id,
                series_name: series_name,
                studio_name: anime_data.StudioList,
                summary: anime_data.Description,
                tags: anime_data.Tags.join(", "),
                poster_url: anime_data.Image
            }
        });
    }

    await prisma.$disconnect();
}

export async function getAnimeInScheduler() : Promise<any> {
    
    const prisma = new PrismaClient();

    const result = await prisma.animeScheduler.findMany({
        where: {
            soft_deleted: false
        },
        include: {
            references: true,
        },
    });

    await prisma.$disconnect();
    
    return result;
}

export async function deleteFromScheduler(id : number) {
    const prisma = new PrismaClient();
    
    await prisma.animeScheduler.update({where: {ab_id: id}, data: {soft_deleted: true}});
    
    await prisma.$disconnect();
}