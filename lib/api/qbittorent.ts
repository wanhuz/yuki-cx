"use server";

import { AddTorrentOptions, QBittorrent } from '@ctrl/qbittorrent';
import parseTorrent from "parse-torrent";
import { addToLog } from './settings';
const DEV_MODE = process.env.DEV_MODE === "true" ? true : false

async function getBase64FromTorrentURL(url : string) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
  
      const arrayBuffer = await response.arrayBuffer();

      const buffer = Buffer.from(arrayBuffer);

      const base64String = buffer.toString("base64");
  
      return base64String;
    } catch (error) {
        console.error(`Error fetching and converting .torrent file:`, error);
        throw error;
    }
  }

export async function addTorrent(
      url : string, 
      qb_url : string, 
      qb_port : number, 
      qb_username : string, 
      qb_password : string, 
      qb_pause_torrent : boolean, 
      qb_default_label : string,
      file_names: string[]
  ) 
  {

    try {
      const client = new QBittorrent({
        baseUrl: qb_url + ':' + qb_port,
        username: qb_username,
        password: qb_password,
      });

      const base64Torrent = await getBase64FromTorrentURL(url)
      const isPaused = qb_pause_torrent ? "true" : "false";

      const torrentOption: Partial<AddTorrentOptions> = {
        paused: isPaused,
        category: qb_default_label
      }

      const status = await client.addTorrent(base64Torrent, torrentOption);

      if (status) {
        file_names.map(async (name) => {
          await addToLog(name, new Date());
        })

        return 200
      }
        
      return 500
    } catch (error) {
      console.error(`Error creating QBittorrent client: `, error);
      throw error;
    }
}

export async function healthCheck(qb_url : string, qb_port : number, qb_username : string, qb_password : string) {
  try {
    const client = new QBittorrent({
      baseUrl: qb_url + ':' + qb_port,
      username: qb_username,
      password: qb_password,
    });

    // Try to log in manually
    await client.login();

    // Call a simple API endpoint to confirm connection
    const version = await client.getAppVersion();
    
    if (DEV_MODE) {
      console.log(`qBittorrent is reachable. Version: ${version}`);
    }

    return {
      ok: true,
      message: "Connected to qBittorrent",
      version,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("qBittorrent health check failed:", message || err);

    return {
      ok: false,
      message: message || "Unknown error",
    };
  }
}
