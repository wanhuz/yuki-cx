/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import sqlite3 from "better-sqlite3";
import { XMLParser  } from "fast-xml-parser";

const animeMappingURL = "https://raw.githubusercontent.com/Anime-Lists/anime-lists/master/anime-list.xml";
const localXMLFilePath = "resources/anime-list.xml";
const dbLocalFilePath = "resources/yuki-cx.db";

const parseNumber = (value: string | null | undefined): number | null => {
  const num = Number(value);

  return Number.isFinite(num) ? num : null; 
};

const fetchXMLFile = async (url: string, outputPath: string) => {
  try {
    console.log(`Fetching XML file from ${url}...`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch XML file: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    fs.writeFileSync(outputPath, data, "utf8");
    console.log(`XML file saved to ${outputPath}`);
  } catch (error) {
    console.error("Error fetching XML file:", error);
    process.exit(1);
  }
};

const readAndParseXML = (filePath: string) => {
  try {
    const xmlData = fs.readFileSync(filePath, "utf8");

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
  } catch (error) {
    console.error("Error reading or parsing XML file:", error);
    process.exit(1);
  }
};

const createDatabase = (animeList: any[], dbFilePath : string) => {
  try {
    const db = sqlite3(dbFilePath);

    db.exec(`
      DROP TABLE IF EXISTS anime
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS anime (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        anidbid NUMBER,
        tvdbid NUMBER,
        tmdbid NUMBER,
        imdbid NUMBER,
        name TEXT,
        studio TEXT
      )
    `);

    const insert = db.prepare(`
      INSERT INTO anime (anidbid, tvdbid, tmdbid, imdbid, name, studio) 
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
  await fetchXMLFile(animeMappingURL, localXMLFilePath);
  const animeList = readAndParseXML(localXMLFilePath);
  createDatabase(animeList, dbLocalFilePath);

  try {
    fs.unlinkSync(localXMLFilePath);
    console.log(`Deleted local XML file: ${localXMLFilePath}`);
  } catch (error) {
    console.error("Error deleting XML file:", error);
    process.exit(1);
  }
};

main();
