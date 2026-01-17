"use client";

import SettingsForm from "@/components/SettingsForm";
type FieldType = "text" | "password" | "checkbox" | "select";

export default function SchedulerSettingsPage() {
  const fields = [
    { name: "Pause Scheduler", label: "Pause Scheduler?", type: "checkbox" as FieldType },        
  ];

  const handleSubmit = async (data: any) => {
    console.log(data);
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
