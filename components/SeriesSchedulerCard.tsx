"use client";

import { deleteFromScheduler } from "@/lib/api/scheduler";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

function generateSeriesLink(title : string, id : number) {
    return "/anime/" + encodeURIComponent(title) + "?id=" + id;
}

async function deleteFromSchedulerHandler(id: number, triggerUpdate: () => void) {
    try {
        await deleteFromScheduler(id);
        toast.success("Successfully deleted from scheduler", {position: "bottom-right"});
    } catch (error) {
        toast.error("Failed to delete from scheduler", {position: "bottom-right"});
    }

    triggerUpdate();
}


export default function SeriesCard({
    series_name,
    studio_name,
    poster,
    id,
    summary,
    tags,
    filter_property,
    last_fetched_episode,
    last_fetched_at,
    triggerUpdate
}: {
    series_name: string;
    studio_name: string;
    poster: string;
    id: number;
    summary: string;
    tags: string;
    filter_property: string;
    last_fetched_episode: number;
    last_fetched_at: Date;
    triggerUpdate: () => void;
}) {

    const seriesLink = generateSeriesLink(series_name, id);

    return (
            <div className="flex flex-row rounded-md overflow-hidden shadow bg-white max-w-md hover:bg-gray-100 mx-3">
                <Link href={seriesLink} >
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
                </Link>

                <div className="flex flex-col gap-2 justify-between">
                    <div className="flex flex-col p-3 gap-2">
                        <div className="text-sm font-bold">Episode {last_fetched_episode}</div>
                        <div className="text-xs text-gray-500">
                            Fetched on {last_fetched_at.toLocaleString().replace(',', ' -')}
                        </div>
                        <div className="text-xs text-gray-500">
                            {filter_property}
                        </div>
                        <p className="text-xs text-gray-700 line-clamp-4">{summary}</p>
                    </div>
                    
                    <div className="flex flex-row gap-2 mt-2 bg-gray-50 rounded w-full py-2 justify-between">
                        <div className="px-3 flex flex-row gap-2">
                            {tags.split(",").slice(0,2).map((tag, index) => (
                                <span key={index} className={`px-2 py-1 rounded text-xs bg-rose-500 text-white`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <button onClick={() => deleteFromSchedulerHandler(id, triggerUpdate)} className="px-3 text-red-500">
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