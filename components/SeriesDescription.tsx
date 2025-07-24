import { stripHTML } from "@/lib/util/animebytes";

export default function SeriesDescription({description} : {description : string}) {
    return (
        <div className="flex flex-col mt-8 sm:px-4 lg:px-4">
            <b>Synopsis</b>
            <hr></hr>
            <span className="mt-3 text-sm">
                {stripHTML(description)}
            </span>
        </div>
    );
}