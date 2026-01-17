"use client";

import { useState } from "react";
import SettingsCard from "./SettingsCard";
import SettingsSelection from "./SettingsSelection";
import SettingsCheckbox from "./SettingsCheckbox";


type FieldType = "text" | "password" | "checkbox" | "select";

interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  options?: { key: string; value: string }[];
}

interface SettingsFormProps<T extends Record<string, any>> {
  fields: FieldDefinition[];
  initialValues?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
}

export default function SettingsForm<T extends Record<string, any>>({
  fields,
  onSubmit,
}: SettingsFormProps<T>) {

  const [formData, setFormData] = useState<Record<string, string | boolean>>(
    () =>
      fields.reduce((acc, field) => {
        acc[field.name] = field.type === "checkbox" ? false : "";
        return acc;
      }, {} as Record<string, string | boolean>)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;

    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked! : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as T);
  };

  return (
    <form className="px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="mb-6">
          {field.type === "checkbox" ? (
            <SettingsCheckbox
              name={field.name}
              id={field.name}
              label={field.label}
              checked={Boolean(formData[field.name])}
              onChange={(checked: boolean) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.name]: checked,
                }))
              }
            />
          ) : field.type === "select" ? (
            <SettingsSelection
              name={field.name}
              id={field.name}
              label={field.label}
              options={field.options ?? []}
              value={String(formData[field.name] ?? "")}
              onChange={handleChange}
            />
          ) : (
            <SettingsCard
              name={field.name}
              label={field.label}
              id={field.name}
              type={field.type}
              value={String(formData[field.name] ?? "")}
              onChange={handleChange}
            />
          )}
        </div>
      ))}

      <div className="flex items-center justify-between mt-4">
        <button
            className={`ms-auto bg-sky-500 hover:bg-sky-600 text-white py-2 px-6 rounded focus:outline-none focus:shadow-outline ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            type="submit"
            disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
      {feedback && <p className="mt-4 text-sm">{feedback}</p>}
    </form>
  );
}
