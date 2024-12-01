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

export default function SeriesCard({title, poster, id, type, year, isOngoing} : {title: string, poster: string, id : number, type: string, year: string, isOngoing: boolean}) {
    const seriesLink = generateSeriesLink(title, id);

    return (
        <Link href={seriesLink}>
            <div className="max-w-xs h-72 hover:bg-gray-100 overflow-hidden rounded-md" >
                <Image className="w-32 h-48 object-cover rounded-md" src={poster} alt={title} width={160} height={180}></Image>
                <div className="py-4 flex flex-col justify-between min-h-[100px] pt-5">
                    
                    <div className="text-xs px-2  w-32 line-clamp-2 overflow-hidden">{title}</div>
                    <div className="text-xxs px-2 flex flex-row gap-1 flex-wrap w-32">
                        {isOngoing ? generateTagLabel("Airing") : generateTagLabel(type)}
                        {generateTagLabel(year)}
                        
                    </div>
                </div>
            </div>
        </Link>
    );
  }