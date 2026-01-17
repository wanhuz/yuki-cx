"use client";

export default function SettingsCheckbox({
  id,
  name,
  label,
  checked,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const style = `flex items-center`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={style}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={handleChange}
        className="mr-2"
      />
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
    </div>
  );
}


