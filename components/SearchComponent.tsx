"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchContent from "@/components/SearchContent";
import { Anime } from "@/lib/interface/anime";
import SearchFiltersComponent from "./SearchFilterComponent";

export default function SearchComponent() {
  const [contentCard, setContentCard] = useState<Anime[]>([]);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [searchFilters, setSearchFilters] = useState<SearchFiltersState>({
    type: "All",
    status: "Any",
    count: "25",
  });

  return (
    <>
      <div className="container mx-auto my-8 px-2 md:px-0">
        <div className="flex items-center justify-center">
          <SearchBar updateSearchDisplay={setContentCard} onIsSearch={setIsSearch} filters={searchFilters}/>
          <SearchFiltersComponent
            initialFilters={searchFilters}
            onApply={(filters) => {
              setSearchFilters(filters) 
              setIsSearch(true);
            }}
            onCancel={() => {
              setSearchFilters({
                type: "All",
                status: "Any",
                count: "25",
              });
              setIsSearch(true);
            }}
          />
        </div>
      </div>
        <SearchContent contentCard={contentCard} isSearch={isSearch} />
    </>
  );
}