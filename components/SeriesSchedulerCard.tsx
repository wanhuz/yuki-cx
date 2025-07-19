import Image from "next/image";
import Link from "next/link";

function generateSeriesLink(title : string, id : number) {
    return "/anime/" + encodeURIComponent(title) + "?id=" + id;
}

function generateTagLabel(type : string) {
    let style = "inline-block px-2 text-xxs  text-white  rounded-full "
    
    switch(type) {
        case "TV Series":
            style += "bg-blue-500";
            break;
        case "Movie":
            style += "bg-green-500";
            break;
        case "TV Special":
            style += "bg-purple-500";
            break;
        case "OVA":
            style += "bg-orange-500";
            break;
        case "Airing":
            style += "bg-pink-500";
            break;
        default:
            style += "bg-gray-500";
    }

    return (<span className={style}>{type}</span>);
}

export default function SeriesCard({
    series_name,
    studio_name,
    poster,
    id,
    summary,
    tags,
}: {
    series_name: string;
    studio_name: string;
    poster: string;
    id: number;
    summary: string;
    tags: string;
}) {
    const seriesLink = generateSeriesLink(series_name, id);

    return (
    <div className="flex flex-row rounded-md overflow-hidden shadow bg-white max-w-md hover:bg-gray-100 mx-3">

        <div className="w-full min-w-[160px] max-w-[160px] relative rounded-md ">
            <Image
                src={poster}
                alt={series_name}
                width={160} 
                height={180}
                className="w-full h-full object-cover rounded-md"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-3 flex flex-col justify-between">
                <div><b>{series_name}</b></div>
                <div className="font-bold text-xs text-yellow-600">{studio_name}</div>
            </div>
        </div>

        <div className="flex flex-col gap-2 justify-between">
            <div className="flex flex-col p-3 gap-2">
                <div className="text-sm font-bold">Episode 6</div>
                <div className="text-xs text-gray-500">
                    Fetched on 12/12/2022
                </div>
                <div className="text-xs text-gray-500">
                    720p - 30fps
                </div>
                <p className="text-xs text-gray-700 line-clamp-4">{summary}</p>
            </div>
            
            <div className="flex flex-row gap-2 mt-2 bg-gray-50 rounded w-full py-2 justify-between">
                <div className="px-3">
                    <span className="px-2 py-1 bg-rose-100 rounded text-xs">
                    Comedy
                    </span>
                </div>
                <button className="px-3 text-red-500">
                    <svg width="22" height="22" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="5" fill="none" />
                    
                    <line x1="30" y1="50" x2="70" y2="50" stroke="black" strokeWidth="5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    );
  }