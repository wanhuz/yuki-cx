export default function SeriesDescription({description} : {description : string}) {
    return (
        <div className="flex flex-col mt-8">
        <b>Synopsis</b>
        <hr></hr>
        <span className="mt-3 text-sm">
            {description}
        </span>
        </div>
    );
}