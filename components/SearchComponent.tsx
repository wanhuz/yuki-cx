"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchContent from "@/components/SearchContent";
import { Anime } from "@/lib/interface/anime";

export default function SearchComponent() {
  const [contentCard, setContentCard] = useState<Anime[]>([]);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  return (
    <>
        <SearchBar updateSearchDisplay={setContentCard} onIsSearch={setIsSearch} />
        <SearchContent contentCard={contentCard} isSearch={isSearch} />
    </>
  );
}