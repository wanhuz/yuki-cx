"use client";

import SettingsForm from "@/components/SettingsForm";
import { getQBClientSettings, saveQBClientSettings } from "@/lib/api/settings";
import { useEffect, useState } from "react";
import { useSettings } from "../layout";

type FieldType = "text" | "password" | "checkbox" | "select";
type ClientSettings = {
  qb_url: string;
  qb_port: number;
  qb_username: string;
  qb_password: string;
  qb_pause_torrent: boolean;
  qb_default_label: string;
};


export default function ClientSettingsPage() {
  const { setActiveIndex } = useSettings();

  useEffect(() => {
    setActiveIndex(0);
    getQBClientSettings().then((data) => setDefaultSettings(data as ClientSettings));
  }, [setActiveIndex]);

  const [defaultSettings, setDefaultSettings] = useState<ClientSettings | null>(null);

  if (!defaultSettings) return <p className="px-8 py-6">...</p>;

  const fields = [
    { name: "qb_url", label: "URL", type: "text" as FieldType, defaultValue: defaultSettings.qb_url },
    { name: "qb_port", label: "Port", type: "text" as FieldType, defaultValue: defaultSettings.qb_port?.toString() },
    { name: "qb_username", label: "Username", type: "text" as FieldType, defaultValue: defaultSettings.qb_username },
    { name: "qb_password", label: "Password", type: "password" as FieldType },
    { name: "qb_pause_torrent", label: "Add torrent paused", type: "checkbox" as FieldType, defaultValue: defaultSettings.qb_pause_torrent },
    { name: "qb_default_label", label: "Default torrent label", type: "text" as FieldType, defaultValue: defaultSettings.qb_default_label },
  ];

  const handleSubmit = async (data: ClientSettings) => {
    saveQBClientSettings({
      qb_url: data.qb_url,
      qb_port: data.qb_port,
      qb_username: data.qb_username,
      qb_password: data.qb_password,
      qb_pause_torrent: data.qb_pause_torrent,
      qb_default_label: data.qb_default_label
    });
  };

  return (
    <div className="w-full">
      <p className="px-8 pt-6 text-lg">qBittorrent</p>
      <SettingsForm
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
