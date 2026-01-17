"use client";

import { useState } from "react";

export default function SettingsCheckbox({id, name, label, checked: initialChecked, onChange}: {id: string, name: string, label : string, checked: boolean, onChange: (checked: boolean) => void}) {
    const [checked, setChecked] = useState(initialChecked);
    const style = `flex items-center`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setChecked(isChecked);
        onChange(isChecked);
    }

    return (
        <div className={style}>
            <input type="checkbox" id={id} name={name} checked={checked} onChange={handleChange} className="mr-2" />
            <label htmlFor={id} className="text-sm">{label}</label>
        </div>
    );
}



