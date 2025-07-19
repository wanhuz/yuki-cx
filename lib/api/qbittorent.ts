"use server";

import { AddTorrentOptions, QBittorrent } from '@ctrl/qbittorrent';

const client = new QBittorrent({
  baseUrl: process.env.QB_BASEURL,
  username: process.env.QB_USERNAME,
  password: process.env.QB_PASSWORD,
});

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
    const torrentOption: Partial<AddTorrentOptions> = {
      paused: "true",
      category: "Anime"
    }

    const status = await client.addTorrent(base64Torrent, torrentOption);

    if (status)
        return 200
    return 500
}