"use client";

import { searchAnimePage } from "@/lib/app/search";
import { Anime } from "@/lib/interface/anime";
import { useEffect, useState } from "react";

async function onSearch(title : string) {
    const searchResult = await searchAnimePage(title);

    return searchResult;
}
 

export default function SearchBar({
  updateSearchDisplay,
  onIsSearch,
}: {
  updateSearchDisplay: React.Dispatch<React.SetStateAction<Anime[]>>;
  onIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [searchText, setSearchText] = useState('');

    useEffect(() => {
        updateSearchDisplay([]);
        onIsSearch(true);
        const getData = setTimeout(() => {
            
            onSearch(searchText).then((result) => {
                updateSearchDisplay(result!);
                onIsSearch(false);
            });
        }, 1000)
        
        return () => clearTimeout(getData)
      }, [searchText, updateSearchDisplay, onIsSearch])
    
    return (
        <div className="container mx-auto my-8 px-2 md:px-0">
            <div className="flex items-center justify-center">
                <div className="relative w-11/12 mx-auto sm:w-full">
                    <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        value={searchText}
                        placeholder="Search..."
                        onChange={(e) => setSearchText(e.target.value)} />
                </div>
            </div>
        </div>
    );
  }

