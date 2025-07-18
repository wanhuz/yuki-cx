"use server";

import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

export async function addToScheduler(formData : FormData) {
    const ab_id = Number(formData.get('ab_id'));
    const series_name = formData.get('series_name') as string;

    const prisma = new PrismaClient();

    await prisma.animeScheduler.upsert({
        where: { ab_id: ab_id }, 
        update: {},              
        create: {                
            ab_id: ab_id,
            series_name: series_name
        }
    });

    await prisma.$disconnect();
}

export async function getAnimeInScheduler() : Promise<any> {
    
    const prisma = new PrismaClient();

    const result = await prisma.animeScheduler.findMany();

    await prisma.$disconnect();
    
    return result;
}