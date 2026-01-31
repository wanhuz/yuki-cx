"use client";

import { useEffect } from "react";
import { useSettings } from "@/app/(pages)/settings/SettingsContext";
import { SettingsLogs } from "@/components/SettingsLog";


export default function SchedulerSettingsPage() {
  const { setActiveIndex } = useSettings();

  useEffect(() => {
    setActiveIndex(4);
  }, [setActiveIndex]);
 

  return (
    <div className="w-full">
      <p className="px-8 pt-6 text-lg">Logs</p>
      <SettingsLogs />
    </div>
  );
}
