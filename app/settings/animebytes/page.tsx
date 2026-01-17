"use client";

import SettingsForm from "@/components/SettingsForm";
type FieldType = "text" | "password" | "checkbox" | "select";


export default function ABSettingsPage() {
  const fields = [
    {name: "ab_key", label: "AnimeBytes API Key", type: "text" as FieldType}
  ];

  const handleSubmit = async (data: any) => {
    console.log(data);
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
