"use client";

import SettingsForm from "@/components/SettingsForm";
import { getQBClientSettings, saveQBClientSettings } from "@/lib/api/settings";
import { useEffect, useState } from "react";
type FieldType = "text" | "password" | "checkbox" | "select";


export default function ABSettingsPage() {

  useEffect(() => {
    getQBClientSettings().then((data) => setDefaultSettings(data));
  }, []);

  const [defaultSettings, setDefaultSettings] = useState<any | null>(null);

  if (!defaultSettings) return <p className="px-8 py-6">Loading settings...</p>;

  const fields = [
    { name: "qb_url", label: "URL", type: "text" as FieldType, defaultValue: defaultSettings.qb_url },
    { name: "qb_port", label: "Port", type: "text" as FieldType, defaultValue: defaultSettings.qb_port?.toString() },
    { name: "qb_username", label: "Username", type: "text" as FieldType, defaultValue: defaultSettings.qb_username },
    { name: "qb_password", label: "Password", type: "password" as FieldType, defaultValue: defaultSettings.qb_password },
    { name: "qb_pause_torrent", label: "Add torrent paused", type: "checkbox" as FieldType, defaultValue: defaultSettings.qb_pause_torrent },
    { name: "qb_default_label", label: "Default torrent label", type: "text" as FieldType, defaultValue: defaultSettings.qb_default_label },
  ];

  const handleSubmit = async (data: any) => {
    saveQBClientSettings({
      qb_url: data.qb_url,
      qb_port: parseInt(data.qb_port),
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
