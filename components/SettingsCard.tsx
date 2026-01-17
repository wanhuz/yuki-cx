export default function SettingsCard({label, id, placeholder, type, addClass, name, value, onChange}: 
    {label: string, id: string, placeholder?: string, type: string, addClass?: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}
    ) {
    const style = `flex flex-col gap-3 ${addClass}`;

    return (
        <div className={style}>
            <label className="block text-gray-700 text-sm mb-2" htmlFor={id}>
                {label}
            </label>
            <input name={name} onChange={onChange} value={value} className="text-sm max-w-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id={id} type={type} placeholder={placeholder ?? ""}/>
        </div>
    );
}
