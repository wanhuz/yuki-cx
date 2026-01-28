import { search } from "@/lib/api/animebytes";
import { ABGroup } from "@/lib/interface/animebytes";
import { extractOngoingStatus } from "@/lib/util/animebytes";
import { useEffect, useState } from "react";

async function onSearch(title : string, type : string) {

    const searchResult = search(title, type);
 
    const anime_search_result: Anime[] = [];

    await searchResult.then((result) => {
        if (result) {
            result.map((entry: ABGroup) => {

                if (entry.SeriesName.toLowerCase().includes(title.toLowerCase())) {
                    anime_search_result.push({
                        ID: entry.ID, 
                        SeriesName: entry.SeriesName, 
                        FullName: entry.FullName,
                        Description: entry.Description, 
                        Image: entry.Image,
                        Type: entry.GroupName,
                        Aired: entry.Year,
                        Ongoing: extractOngoingStatus(entry.Torrents[0].Property ?? "")
                    } as Anime);
                }
            });
        }
   });

    return anime_search_result;
 }
 

export default function SearchBar({
  onSearchTextChange,
  onIsSearch,
}: {
  onSearchTextChange: React.Dispatch<React.SetStateAction<Anime[]>>;
  onIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [searchText, setSearchText] = useState('');

    useEffect(() => {
        onSearchTextChange([]);
        onIsSearch(true);
        const getData = setTimeout(() => {
            
            onSearch(searchText, "").then((result) => {
                onSearchTextChange(result);
                onIsSearch(false);
            });
        }, 1000)
        
        return () => clearTimeout(getData)
      }, [searchText, onSearchTextChange, onIsSearch])
    
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

