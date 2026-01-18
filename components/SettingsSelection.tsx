
interface Options {
    key : string,
    value : string
}

export default function SettingsSelection({name, id, label, options, value, onChange} : {name : string, id : string, label : string, value : string, options : Options[], onChange : (e : React.ChangeEvent<HTMLSelectElement>) => void}) {
    const style = `flex flex-col gap-3 ` 

    return (
        <div className={style}>
            <label className="block text-gray-700 text-sm  mb-2" htmlFor={id}>
                {label}
            </label>
            <select  name={name} id={id} className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={onChange}>
                {options.map((item, index) => (
                    <option key={index} value={value}>{item.key}</option>
                ))}
            </select>
        </div>
    );
}
