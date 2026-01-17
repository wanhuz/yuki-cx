"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getABSettings() {
  const ab_key = await prisma.settings.findFirst({
    where: { key: "ab_key" },
  });

  return {
    ab_key: ab_key?.value ?? "",
  }
}

export async function getSchedulerSettings() {

  const settingSchedulerPaused = await prisma.settings.findFirst({
    where: { key: "yuki_scheduler_paused" },
  });

  return {
    yuki_scheduler_paused: settingSchedulerPaused?.value === "true",
  }
}

export async function getQBClientSettings() {
  const settingUrl = await prisma.settings.findFirst({
    where: { key: "qb_url" },
  });

  const settingPort = await prisma.settings.findFirst({
    where: { key: "qb_port" },
  });

  const settingUsername = await prisma.settings.findFirst({
    where: { key: "qb_username" },
  });

  const settingPassword = await prisma.settings.findFirst({
    where: { key: "qb_password" },
  });

  const settingPauseTorrent = await prisma.settings.findFirst({
    where: { key: "qb_pause_torrent" },
  });

  const settingDefaultLabel = await prisma.settings.findFirst({
    where: { key: "qb_default_label" },
  });

  return {
    qb_url: settingUrl?.value ?? "",
    qb_port: parseInt(settingPort?.value ?? "0"),
    qb_username: settingUsername?.value ?? "",
    qb_password: settingPassword?.value ?? "",
    qb_pause_torrent: settingPauseTorrent?.value === "true",
    qb_default_label: settingDefaultLabel?.value ?? "",
  };
}

export async function saveABSettings(settings: { ab_key: string}) {
  if (!settings.ab_key) {
    throw new Error("API keys are required.");
  }

  await prisma.settings.upsert({
    where: { key: "ab_key" },
    update: { value: settings.ab_key },
    create: { key: "ab_key", value: settings.ab_key },
  });

  return { success: true };
}

export async function saveSchedulerSettings(settings: { yuki_scheduler_paused: boolean}) {

  if (settings.yuki_scheduler_paused === undefined) {
    throw new Error("No data provided");
  }

  await prisma.settings.upsert({
    where: { key: "yuki_scheduler_paused" },
    update: { value: settings.yuki_scheduler_paused.toString() },
    create: { key: "yuki_scheduler_paused", value: settings.yuki_scheduler_paused.toString() },
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

  prisma.settings.upsert({
    where: { key: "qb_port" },
    update: { value: settings.qb_port.toString() },
    create: { key: "qb_port", value: settings.qb_port.toString() },
  });

  await prisma.settings.upsert({
    where: { key: "qb_username" },
    update: { value: settings.qb_username },
    create: { key: "qb_username", value: settings.qb_username },
  });

  await prisma.settings.upsert({
    where: { key: "qb_password" },
    update: { value: settings.qb_password },
    create: { key: "qb_password", value: settings.qb_password },
  });

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

