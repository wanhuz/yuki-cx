"use server";

import { AddTorrentOptions, QBittorrent, TorrentClientError } from '@ctrl/qbittorrent';
import { ActionResult } from '../type/ActionResult';
import parseTorrent from 'parse-torrent';
import { abFetchTorrent } from './animebytes-torrent-fetch';

const DEV_MODE = process.env.DEV_MODE === "true" ? true : false

async function fetchTorrentBuffer(url: string): Promise<Buffer> {
  const response = await abFetchTorrent(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch torrent file: ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function checkDuplicateTorrent(
  client: QBittorrent,
  buffer: Buffer
): Promise<ActionResult> {
  let infoHash: string;

  try {
    ({ infoHash } = await parseTorrent(buffer));
  } catch {
    return { ok: false, error: "Corrupt or invalid .torrent file", code: "INVALID" };
  }

  const found = await client.listTorrents({ hashes: infoHash.toLowerCase() });

  if (found.length > 0) {
    return { ok: false, error: "Torrent already added", code: "DUPLICATE" };
  }

  return { ok: true };
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
  ) : Promise<ActionResult>
  {

    try {
      const client = new QBittorrent({
        baseUrl: qb_url + ':' + qb_port,
        username: qb_username,
        password: qb_password,
      });

      const buffer = await fetchTorrentBuffer(url);

      if (buffer.length < 100) {
        return { 
          ok: false, 
          error: "Invalid torrent data", 
          code: "INVALID" 
        };
      }

      const check = await checkDuplicateTorrent(client, buffer);

      if (!check.ok) {
        console.log("Duplicate torrent found, skipping...");
        
        return check;
      }

      const torrentOption: Partial<AddTorrentOptions> = {
        paused: qb_pause_torrent ? "true" : "false",
        stopped: qb_pause_torrent ? "true" : "false", // Version 5x
        category: qb_default_label
      }

      try {
        await client.addTorrent(buffer.toString('base64'), torrentOption);
      }
      catch (error) {
        if (error instanceof TorrentClientError) {

          console.error("qBittorrent error:", {
            code: error.code,
            status: error.status,
            message: error.message,
            cause: (error as Error & { cause?: unknown }).cause,
          });

          if (error.code === "unauthorized") {
            return { ok: false, error: "qBittorrent login failed, check username and password", code: "UNAUTHORIZED" };
          }

          return {
            ok: false,
            error: error.message,
            code: "REJECTED",
          };
        }
      }

      const now = new Date();
      for (const name of file_names) {
        await Log(name, now);
      }

      return { ok: true };

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      console.error(`addTorrent failed: `, message);

      return {
        ok: false,
        error: message,
        code: "UNKNOWN"
      };
    }
}

export async function healthCheck(qb_url : string, qb_port : number, qb_username : string, qb_password : string): Promise<ActionResult> {
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
      version
    } as ActionResult;

  } 
  catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    
    console.error("qBittorrent health check failed:", message || err);

    return {
      ok: false,
      error: message
    } as ActionResult;
    
  }
}
