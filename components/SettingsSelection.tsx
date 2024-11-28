
interface Options {
    key : string,
    value : string
}

export default function SettingsSelection({name, id, options, addClass} : {name : string, id : string, options : Options[], addClass : string}) {
    const style = `flex flex-col gap-3 ${addClass}` 

    return (
        <div className={style}>
            <label className="block text-gray-700 text-sm  mb-2" htmlFor={id}>
                {name}
            </label>
            <select id={id} className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {options.map((item, index) => (
                    <option key={index} value={item.value}>{item.key}</option>
                ))}
            </select>
        </div>
    );
}