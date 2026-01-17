"use client";

import Image from "next/image";
import Link from "next/link";

function generateSeriesLink(title : string, id : number) {
    return "/anime/" + encodeURIComponent(title) + "?id=" + id;
}

function hashToColor(input: string) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
}

export default function EpisodeCalendarCard({
    series_name,
    poster,
    id,
    summary,
    tags,
    number,
    title,
}: {
    series_name: string;
    poster: string;
    id: number;
    summary: string;
    tags: string;
    number: number;
    title: string;
}) {

    const seriesLink = generateSeriesLink(series_name, id);

    return (
        <div>

            {/* <hr className="border-gray-200 dark:border-gray-700 mb-3"></hr> */}

            <div className="flex flex-row rounded-md overflow-hidden shadow bg-white max-w-md hover:bg-gray-100">
                <Link href={seriesLink} >
                    <div className="w-full h-full min-w-[160px] max-w-[160px] relative rounded-md ">
                        <Image
                            src={poster}
                            alt={series_name}
                            width={160} 
                            height={180}
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                </Link>

                <div className="flex flex-col gap-2 justify-between">
                    <div className="flex flex-col p-3 gap-2">
                        <div className="text-sm font-bold">Episode {number}</div>
                        <div className="text-xs text-gray-500">
                            {title ? title : "Untitled"}
                        </div>

                        <div className="text-xs text-gray-500 flex flex-wrap gap-1 mt-1 mb-2">

                        </div>

                        <p className="text-xs text-gray-700 line-clamp-5">{summary}</p>
                    </div>
                    
                    <div className="flex flex-row gap-2 mt-2 bg-gray-50 rounded w-full py-2 justify-between">
                        <div className="px-3 flex flex-row gap-2">
                            {tags.split(",").slice(0,2).map((tag, index) => (
                                <span key={index} style={{ backgroundColor: hashToColor(poster) }} className={`px-2 py-1 rounded text-xs bg-rose-500 text-white`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }