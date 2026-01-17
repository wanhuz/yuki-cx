"use client";

import SettingsForm from "@/components/SettingsForm";
import { getSchedulerSettings } from "@/lib/api/settings";
import { useEffect, useState } from "react";
type FieldType = "text" | "password" | "checkbox" | "select";

export default function DownloadsSettingsPage() {

  const fields = [
    { name: "url", label: "qBittorent URL", type: "text" as FieldType },
  ];

  const handleSubmit = async (data: any) => {
    console.log(data);
  };
  
  return (
    <div className="w-full">
      <p className="px-8 pt-6  text-lg">One-click Download</p>
      <SettingsForm
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
