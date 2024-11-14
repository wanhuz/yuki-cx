import { search } from "@/lib/api/animebytes";
import { useEffect, useState } from "react";

async function getServerSideProps(title : string, type : string) {
    const searchResult = search(title, type);
 
    const anime_search_result: Anime[] = [];

    await searchResult.then((result) => {
        result.map((entry: { ID: number; SeriesName: string; Description: string; Image: string; }) => {
            if (entry.SeriesName.toLowerCase().includes(title.toLowerCase())) {
                anime_search_result.push({
                    ID: entry.ID, 
                    SeriesName: entry.SeriesName, 
                    Description: entry.Description, 
                    Image: entry.Image} as Anime);
            }
        });
   });
 
    return anime_search_result;
 }
 

export default function SearchBar({onSearchTextChange} : {onSearchTextChange: React.Dispatch<React.SetStateAction<Anime[]>> }) {
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const getData = setTimeout(() => {
            getServerSideProps(searchText, "").then((result) => {
                onSearchTextChange(result);
            });;
        }, 500)
    
        return () => clearTimeout(getData)
      }, [searchText, onSearchTextChange])
    
    return (
        <div className="container mx-auto my-8">
            <div className="flex items-center justify-center">
                <div className="relative w-full">
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

