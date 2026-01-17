"use client";

import SettingsForm from "@/components/SettingsForm";
import { getABSettings, saveABSettings } from "@/lib/api/settings";
import { useEffect, useState } from "react";
type FieldType = "text" | "password" | "checkbox" | "select";


export default function ABSettingsPage() {
  const [defaultSettings, setDefaultSettings] = useState<any | null>(null);

  useEffect(() => {
    getABSettings().then((data) => setDefaultSettings(data));
  }, []);

  if (!defaultSettings) return <p className="px-8 py-6">Loading settings...</p>;

  const fields = [
    {name: "ab_key", label: "AnimeBytes API Key", type: "text" as FieldType, defaultValue: defaultSettings.ab_key},
  ];

  const handleSubmit = async (data: any) => {
    saveABSettings({
      ab_key: data.ab_key,
    });
  };

  return (
    <div className="w-full">
      <p className="px-8 pt-6 text-lg">AnimeBytes</p>
      <SettingsForm
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
