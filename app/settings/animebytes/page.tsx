"use client";

import SettingsForm from "@/components/SettingsForm";
import { getABSettings, saveABSettings } from "@/lib/api/settings";
import { useEffect, useState } from "react";
import { useSettings } from "@/app/settings/SettingsContext";

type FieldType = "text" | "password" | "checkbox" | "select";
type ABSettings = {
  ab_username: string;
  ab_key?: string | null;
};



export default function ABSettingsPage() {
  const { setActiveIndex } = useSettings();
  const [defaultSettings, setDefaultSettings] = useState<ABSettings | null>(null);

  useEffect(() => {
    setActiveIndex(2);
    getABSettings().then((data) => setDefaultSettings(data as ABSettings));
  }, [setActiveIndex]);

  if (!defaultSettings) return <p className="px-8 py-6">...</p>;

  const fields = [
    {name: "ab_username", label: "AnimeBytes Username", type: "text" as FieldType, defaultValue: defaultSettings.ab_username},
    {name: "ab_key", label: "AnimeBytes Pass Key", type: "password" as FieldType},
  ];

  const handleSubmit = async (data: ABSettings) => {
    saveABSettings({
      ab_key: data.ab_key || "",
      ab_username: data.ab_username
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
