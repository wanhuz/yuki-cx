"use client";

import SettingsForm from "@/components/SettingsForm";
import { getSchedulerSettings, saveSchedulerSettings } from "@/lib/api/settings";
import { useEffect, useState } from "react";
import { useSettings } from "@/app/settings/SettingsContext";

type FieldType = "text" | "password" | "checkbox" | "select";
type SchedulerSettings = {
  yuki_scheduler_paused: boolean;
};

export default function SchedulerSettingsPage() {
  const { setActiveIndex } = useSettings();
  const [defaultSettings, setDefaultSettings] = useState<SchedulerSettings | null>(null);

  useEffect(() => {
    setActiveIndex(1);
    getSchedulerSettings().then((data) => setDefaultSettings(data as SchedulerSettings));
  }, [setActiveIndex]);

  if (!defaultSettings) return <p className="px-8 py-6">...</p>;

  const fields = [
    { name: "yuki_scheduler_paused", label: "Pause Scheduler", type: "checkbox" as FieldType, defaultValue: defaultSettings.yuki_scheduler_paused },        
  ];

  const handleSubmit = async (data: SchedulerSettings) => {
    saveSchedulerSettings({
      yuki_scheduler_paused: data.yuki_scheduler_paused,
    });
  };

  return (
    <div className="w-full">
      <p className="px-8 pt-6 text-lg">Scheduler</p>
      <SettingsForm
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
