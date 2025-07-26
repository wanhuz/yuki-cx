"use server";

import { AddTorrentOptions, QBittorrent } from '@ctrl/qbittorrent';

const client = new QBittorrent({
  baseUrl: process.env.QB_BASEURL,
  username: process.env.QB_USERNAME,
  password: process.env.QB_PASSWORD,
});

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

export async function addTorrent(url : string) {
    const base64Torrent = await getBase64FromTorrentURL(url)
    const pausedOpt = process.env.DEV_MODE === "true" ? "true" : "false"

    const torrentOption: Partial<AddTorrentOptions> = {
      paused: pausedOpt,
      category: "Anime"
    }

    const status = await client.addTorrent(base64Torrent, torrentOption);

    if (status)
        return 200
    return 500
}

export async function healthCheck() {
  try {
    const client = new QBittorrent({
      baseUrl: process.env.QB_BASEURL,
      username: process.env.QB_USERNAME,
      password: process.env.QB_PASSWORD,
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
