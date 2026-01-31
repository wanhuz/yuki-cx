"use client";

import SettingsForm from "@/components/SettingsForm";
import { getFanartTVSettings, saveFanartTVSettings } from "@/lib/api/settings";
import { useEffect, useState } from "react";
import { useSettings } from "@/app/(pages)/settings/SettingsContext";

type FieldType = "text" | "password" | "checkbox" | "select";
type FanartTVSettings = {
  fanart_key?: string | null;
};



export default function FanartTVSettingsPage() {
  const { setActiveIndex } = useSettings();
  const [defaultSettings, setDefaultSettings] = useState<FanartTVSettings | null>(null);

  useEffect(() => {
    setActiveIndex(3);
    getFanartTVSettings().then((data) => setDefaultSettings(data as FanartTVSettings));
  }, [setActiveIndex]);

  if (!defaultSettings) return <p className="px-8 py-6">...</p>;

  const fields = [
    {name: "fanart_key", label: "Fanart.TV passkey", type: "password" as FieldType},
  ];

  const handleSubmit = async (data: FanartTVSettings) => {
    saveFanartTVSettings({
      fanart_key: data.fanart_key || ""
    });
  };

  return (
    <div className="w-full">
      <p className="px-8 pt-6 text-lg">Fanart.TV</p>
      <SettingsForm
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
