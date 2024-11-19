"use server";
import Database from 'better-sqlite3';

const dbLocalFilePath = "resources/yuki-cx.db";

interface AnimeRow {
    tvdbid: number; 
}

export function getTVDBId(anidbId : number) {
    try {
        const db = new Database(dbLocalFilePath, { readonly: true });

        const query = `SELECT tvdbid FROM anime WHERE anidbid = ?`;
        const row = db.prepare(query).get(anidbId) as AnimeRow | undefined;

        db.close();

        return row ? row.tvdbid : null;
    } catch (error) {
        console.error("Error querying the database:", error);
        throw error; 
    }
}