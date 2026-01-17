"use client";

import SettingsForm from "@/components/SettingsForm";
type FieldType = "text" | "password" | "checkbox" | "select";


export default function ABSettingsPage() {
  const fields = [
    {name: "url", label: "qBittorent URL", type: "text" as FieldType},
    { name: "port", label: "Port", type: "text" as FieldType },
    { name: "username", label: "Username", type: "text" as FieldType },
    { name: "password", label: "Password", type: "password" as FieldType },
    { name: "addTorrentPaused", label: "Add torrent paused?", type: "checkbox" as FieldType },
    { name: "label", label: "Default torrent label", type: "text" as FieldType },
  ];

  const handleSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <div className="w-full">
      <p className="px-8 pt-6 text-lg">qBittorent</p>
      <SettingsForm
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
