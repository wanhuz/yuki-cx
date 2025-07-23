"use client";

import { useState } from "react";
import {AddToSchedulerForm} from "./AddToSchedulerForm";
import FilterProperty from "./FilterProperty";
import { Popover, PopoverButton } from "@headlessui/react";
import { extractTorrentFilter } from "@/lib/util/torrent";


export function AddToSchedulerComponent({ anime_data }: { anime_data: Anime }) {
    const [filters, setFilters] = useState<Filters>({  });
    const seriesFilter = extractTorrentFilter(anime_data.Torrents);

    return (
        <>
            <div className="flex flex-row space-x-3 font-bold ">
                <button disabled className="bg-sky-500 text-white py-1 px-3 hover:bg-sky-600 h-12 rounded-xl text-sm sm:text-md disabled:bg-sky-300"> Add to Download </button>
                {
                  anime_data?.Ongoing ? 
                    <AddToSchedulerForm
                        anime_data={anime_data}
                        filters={filters}
                    /> : null
                }

                <Popover className="relative">
                    <PopoverButton className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
                        ⚙️
                    </PopoverButton>
                        <FilterProperty
                            filters={seriesFilter}
                            onFiltersChange={setFilters}
                        />
                </Popover>
              </div>


        </>
    );
}