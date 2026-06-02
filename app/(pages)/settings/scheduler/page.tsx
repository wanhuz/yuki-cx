"use client";

import SettingsForm from "@/components/SettingsForm";
import { getSchedulerSettings, saveSchedulerSettings } from "@/lib/api/settings";
import { useEffect, useState } from "react";
import { useSettings } from "@/app/(pages)/settings/SettingsContext";

type FieldType = "text" | "password" | "checkbox" | "select";
type SchedulerSettings = {
  yuki_scheduler_paused: boolean;
  qb_scheduler_default_label: string;
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
    { name: "yuki_scheduler_paused", label: "Pause scheduler", type: "checkbox" as FieldType, defaultValue: defaultSettings.yuki_scheduler_paused },     
    { name: "qb_scheduler_default_label", label: "Default scheduler torrent label", type: "text" as FieldType, defaultValue: defaultSettings.qb_scheduler_default_label },   
  ];

  const handleSubmit = async (data: SchedulerSettings) => {
    saveSchedulerSettings({
      yuki_scheduler_paused: data.yuki_scheduler_paused,
      qb_scheduler_default_label: data.qb_scheduler_default_label
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
