"use server";

import Database from 'better-sqlite3';

interface AnimeRow {
    tvdbid: number; 
}

const dbLocalFilePath = "resources/yuki-cx.db";
const loginEndpoint = "https://api4.thetvdb.com/v4/login";
const artworkEndpoint = "https://api4.thetvdb.com/v4/series/{id}/artworks";
const apikey = "";

export default async function authorize() {
    try {
        const response = await fetch(loginEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apikey: apikey,
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          return 500;
        }
  
        // Respond with the tokens
        return data.token;
      } catch (error) {
        console.error('Login error:', error);
        return 500;
      }
}

export async function getBackgroundArtwork(id : number, token : string) {
    const seriesArtworkEndpoint = artworkEndpoint.replace("{id}", id.toString()) + "?type=3";
    const authorizationToken = "Bearer " + token;
    
    try {
        const response = await fetch(seriesArtworkEndpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authorizationToken
          }
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          return 500;
        }

        const artworks = data.data.artworks;

        const normalizeScore = (score: number): number => {
          if (score >= 100000) return score - 100000; 
          else return score; 
        };
        
        const normalizedData = artworks.map(item => ({
          ...item,
          score: normalizeScore(item.score),
        }));

        const artworksWithHighestScore = normalizedData.reduce((prev, current) =>
          current.score > prev.score ? current : prev
        );
  
        return artworksWithHighestScore.image;
      } catch (error) {
        console.error('Login error:', error);
        return 500;
      }
}


export async function getTVDBId(anidbId : number) {
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