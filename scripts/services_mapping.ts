/* eslint-disable @typescript-eslint/no-explicit-any */
import sqlite3 from "better-sqlite3";
import { XMLParser  } from "fast-xml-parser";
import 'dotenv/config'

const animeMappingURL = process.env.SERVICE_MAPPING_URL ?? ""
const dbLocalFilePath =  process.env.DATABASE_URL_PREBUILD ?? ""

const parseNumber = (value: string | null | undefined): number | null => {
  const num = Number(value);

  return Number.isFinite(num) ? num : null; 
};

const fetchXMLFile = async (url: string) => {
  try {
    console.log(`Fetching XML file from ${url}...`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch XML file: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();

    return data;

  } catch (error) {
    console.error("Error fetching XML file:", error);
    process.exit(1);
  }
};

const readAndParseXML = (xmlData: string) => {

    const parser = new XMLParser({
      ignoreAttributes: false, 
      attributeNamePrefix: "@_", 
    });

    const parsedData = parser.parse(xmlData);

    if (!parsedData || !parsedData["anime-list"] || !parsedData["anime-list"].anime) {
      throw new Error("Invalid XML structure. Could not find 'anime' nodes.");
    }

    const animeArray = Array.isArray(parsedData["anime-list"].anime)
      ? parsedData["anime-list"].anime
      : [parsedData["anime-list"].anime];

    return animeArray.map((anime : any) => ({
      anidbid: parseNumber(anime["@_anidbid"]),
      tvdbid: parseNumber(anime["@_tvdbid"]),
      tmdbid: parseNumber(anime["@_tmdbid"]),
      imdbid: parseNumber(anime["@_imdbid"]),
      name: anime.name || null,
      studio: anime["supplemental-info"]?.studio || null,
    }));

};

const createDatabase = (animeList: any[], dbFilePath : string) => {
  try {
    const db = sqlite3(dbFilePath);

    db.exec(`
      DELETE FROM ServiceMapping
    `);

    const insert = db.prepare(`
      INSERT INTO ServiceMapping (anidbid, tvdbid, tmdbid, imdbid, name, studio) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((animes) => {
      for (const anime of animes) {
        insert.run(
          anime["anidbid"] || null,
          anime["tvdbid"] || null,
          anime["tmdbid"] || null,
          anime["imdbid"] || null,
          anime.name || null,
          anime["supplemental-info"]?.studio || null
        );
      }
    });

    insertMany(animeList);
    console.log("Database created and data inserted successfully!");
    db.close();
  } catch (error) {
    console.error("Error creating or populating database:", error);
    process.exit(1);
  }
};

const main = async () => {
  const animeServiceMapping = await fetchXMLFile(animeMappingURL);
  const animeList = readAndParseXML(animeServiceMapping);
  createDatabase(animeList, dbLocalFilePath);
};

main();
