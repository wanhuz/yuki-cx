import { generateSeriesLink, generateTagLabel } from "@/lib/app/series";
import Image from "next/image";
import Link from "next/link";

export default function SeriesCard({
    title,
    poster,
    id,
    type,
    year,
    isOngoing,
    summary
}: {
    title: string;
    poster: string;
    id: number;
    type: string;
    year: string;
    isOngoing: boolean;
    summary: string;
}) {
    const seriesLink = generateSeriesLink(title, id);

    return (
            <Link href={seriesLink} className="flex-shrink-0 flex-grow-0 w-full px-2 py-1 md:px-0 md:flex-initial md:w-auto md:py-0 ">
                <div className="w-full md:w-min-content md:max-w-min md:h-min-content flex flex-row md:flex-col overflow-hidden rounded-md hover:bg-gray-100">
                    <Image 
                        className="w-32 h-48 object-cover rounded-md" 
                        src={poster} 
                        alt={title} 
                        width={160} 
                        height={180}
                    />
                    <div className="flex flex-col justify-between w-full px-2 sm:px-0 py-4 md:py-4 md:pt-5 md:min-h-[100px]">
                        <div className="w-full px-2 text-sm font-semibold md:font-normal md:w-auto md:text-xs line-clamp-2 overflow-hidden">{title}</div>
                        <div className="w-full px-2 text-xs md:w-auto line-clamp-4 md:hidden">{summary ? summary : ""}</div>
                        <div className="flex flex-row gap-1 flex-wrap w-32 px-2 text-xxs">
                            {isOngoing ? generateTagLabel("Airing") : generateTagLabel(type)}
                            {generateTagLabel(year)}
                        </div>
                    </div>
                </div>
            </Link>
    );
  }