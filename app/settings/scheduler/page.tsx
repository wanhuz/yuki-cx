"use client";

import SettingsForm from "@/components/SettingsForm";
import { getSchedulerSettings, saveSchedulerSettings } from "@/lib/api/settings";
import { useEffect, useState } from "react";

type FieldType = "text" | "password" | "checkbox" | "select";

export default function SchedulerSettingsPage() {
  const [defaultSettings, setDefaultSettings] = useState<any | null>(null);

  useEffect(() => {
    getSchedulerSettings().then((data) => setDefaultSettings(data));
  }, []);

  if (!defaultSettings) return <p className="px-8 py-6">Loading settings...</p>;

  const fields = [
    { name: "yuki_scheduler_paused", label: "Pause Scheduler", type: "checkbox" as FieldType, defaultValue: defaultSettings.yuki_scheduler_paused },        
  ];

  const handleSubmit = async (data: any) => {
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
