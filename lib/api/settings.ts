"use server";

import { PrismaClient } from '@prisma/client';
import { QBSettings } from '../type/QBSettings';

const prisma = new PrismaClient();

export async function getABSettings() {
  const ab_key = await prisma.settings.findFirst({
    where: { key: "ab_key" },
  });

  const ab_username = await prisma.settings.findFirst({
    where: { key: "ab_username" },
  });

  return {
    ab_key: ab_key?.value,
    ab_username: ab_username?.value
  }
}

export async function getFanartTVSettings() {
  const fanart_api_key = await prisma.settings.findFirst({
    where: { key: "fanart_api_key" },
  });

  return {
    fanart_api_key: fanart_api_key?.value,
  }
}


export async function getSchedulerSettings() {
  const settingSchedulerPaused = await prisma.settings.findFirst({
    where: { key: "yuki_scheduler_paused" },
  });

  const settingSchedulerQBPaused = await prisma.settings.findFirst({
    where: { key: "qb_scheduler_pause_torrent" },
  });

  const settingSchedulerDefaultLabel = await prisma.settings.findFirst({
    where: { key: "qb_scheduler_default_label" },
  });

  return {
    yuki_scheduler_paused: settingSchedulerPaused?.value === "true",
    qb_scheduler_pause_torrent: settingSchedulerQBPaused?.value === "true",
    qb_scheduler_default_label: settingSchedulerDefaultLabel?.value
  }
}


export async function getQBClientSettings(): Promise<QBSettings> {
  const rows = await prisma.settings.findMany({
    where: {
      key: {
        in: [
          "qb_url", "qb_port", "qb_username", "qb_password",
          "qb_pause_torrent", "qb_default_label",
          "qb_scheduler_pause_torrent", "qb_scheduler_default_label",
        ],
      },
    },
  });

  const s = new Map(rows.map((r) => [r.key, r.value]));
  const bool = (key: string) => s.get(key)?.trim().toLowerCase() === "true";
  const port = parseInt(s.get("qb_port") ?? "", 10);

  return {
    connection: {
      url: s.get("qb_url") ?? "",
      port: Number.isNaN(port) ? 80 : port,
      username: s.get("qb_username") ?? "",
      password: s.get("qb_password") ?? "",
    },
    add: {
      manual: {
        pauseTorrent: bool("qb_pause_torrent"),
        label: s.get("qb_default_label") ?? "",
      },
      scheduler: {
        pauseTorrent: bool("qb_scheduler_pause_torrent"),
        label: s.get("qb_scheduler_default_label") ?? "",
      },
    },
  };
}


export async function saveABSettings(settings: { 
  ab_key: string,
  ab_username: string
}) {

  if (settings.ab_key) {
    await prisma.settings.upsert({
    where: { key: "ab_key" },
    update: { value: settings.ab_key },
    create: { key: "ab_key", value: settings.ab_key },
  });
  }

  await prisma.settings.upsert({
    where: { key: "ab_username" },
    update: { value: settings.ab_username },
    create: { key: "ab_username", value: settings.ab_username},
  });

  return { success: true };
}

export async function saveFanartTVSettings(settings: { 
  fanart_api_key: string,
}) {

  if (settings.fanart_api_key) {
    await prisma.settings.upsert({
    where: { key: "fanart_api_key" },
    update: { value: settings.fanart_api_key },
    create: { key: "fanart_api_key", value: settings.fanart_api_key },
  });
  }

  return { success: true };
}

export async function saveSchedulerSettings(
    settings: { 
      yuki_scheduler_paused: boolean,
      qb_scheduler_pause_torrent: boolean,
      qb_scheduler_default_label: string
    }) 
  {

  if (settings.yuki_scheduler_paused === undefined) {
    throw new Error("No data provided");
  }

  await prisma.settings.upsert({
    where: { key: "yuki_scheduler_paused" },
    update: { value: settings.yuki_scheduler_paused.toString() },
    create: { key: "yuki_scheduler_paused", value: settings.yuki_scheduler_paused.toString() },
  });

  await prisma.settings.upsert({
    where: { key: "qb_scheduler_pause_torrent" },
    update: { value: settings.qb_scheduler_pause_torrent.toString() },
    create: { key: "qb_scheduler_pause_torrent", value: settings.qb_scheduler_pause_torrent.toString() },
  });

  await prisma.settings.upsert({
    where: { key: "qb_scheduler_default_label" },
    update: { value: settings.qb_scheduler_default_label.toString() },
    create: { key: "qb_scheduler_default_label", value: settings.qb_scheduler_default_label.toString() },
  });

  return { success: true };
}

export async function saveQBClientSettings(settings: {
    qb_url: string;
    qb_port: number;
    qb_username: string;
    qb_password: string;
    qb_pause_torrent: boolean;
    qb_default_label: string;
}) {
  
  if (!settings.qb_url || !settings.qb_port) {
    throw new Error("Client type, URL, and port are required.");
  }

  await prisma.settings.upsert({
    where: { key: "qb_url" },
    update: { value: settings.qb_url },
    create: { key: "qb_url", value: settings.qb_url },
  });

  await prisma.settings.upsert({
    where: { key: "qb_port" },
    update: { value: settings.qb_port.toString() },
    create: { key: "qb_port", value: settings.qb_port.toString() },
  });

  await prisma.settings.upsert({
    where: { key: "qb_username" },
    update: { value: settings.qb_username },
    create: { key: "qb_username", value: settings.qb_username },
  });

  if (settings.qb_password) {
    await prisma.settings.upsert({
      where: { key: "qb_password" },
      update: { value: settings.qb_password },
      create: { key: "qb_password", value: settings.qb_password },
    });
  }

  await prisma.settings.upsert({
    where: { key: "qb_pause_torrent" },
    update: { value: settings.qb_pause_torrent.toString() },
    create: { key: "qb_pause_torrent", value: settings.qb_pause_torrent.toString() },
  });

  await prisma.settings.upsert({
    where: { key: "qb_default_label" },
    update: { value: settings.qb_default_label },
    create: { key: "qb_default_label", value: settings.qb_default_label },
  });

  return  { success: true };
}

export async function getDownloadedTorrent(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;

  // Fetch the page of logs
  const downloadedTorrent = await prisma.downloadLogs.findMany({
    skip,
    take: pageSize,
    orderBy: {
      download_at: "desc",
    },
  });

  // Get total count for pagination
  const totalCount = await prisma.downloadLogs.count();

  return {
    data: downloadedTorrent,
    totalCount,
  };
}

export async function addToLog(title: string, download_at: Date) {
  await prisma.downloadLogs.create({data: {title, download_at}});
}