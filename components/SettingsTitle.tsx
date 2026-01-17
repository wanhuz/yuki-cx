export default function SettingsTitle({title} : {title : string}) {
    return (
        <div className="mb-8"> 
            <p className="text-md mb-2">{title}</p>
            <hr />
        </div>
    );
}