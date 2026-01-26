"use server";

import { AddTorrentOptions, QBittorrent } from '@ctrl/qbittorrent';
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
      file_names: string[],
      Log: (name: string, date: Date) => Promise<void> = async () => {}
  ) 
  {

    try {
      const client = new QBittorrent({
        baseUrl: qb_url + ':' + qb_port,
        username: qb_username,
        password: qb_password,
      });

      const base64Torrent = await getBase64FromTorrentURL(url)

      if (!base64Torrent || base64Torrent.length < 100) {
        return { 
          ok: false, 
          error: "Invalid torrent data" 
        };
      }

      const torrentOption: Partial<AddTorrentOptions> = {
        paused: qb_pause_torrent ? "true" : "false",
        category: qb_default_label
      }


      const status = await client.addTorrent(base64Torrent, torrentOption);

      if (status) {
        for (const name of file_names) {
          await Log(name, new Date());
        }
      }

      return {
        ok: true,
        error: null
      };



    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`addTorrent failed: `, message);

      return {
        ok: false,
        error: message,
      };
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
