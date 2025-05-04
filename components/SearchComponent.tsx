"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchContent from "@/components/SearchContent";

export default function SearchComponent() {
  const [contentCard, setContentCard] = useState<Anime[]>([]);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  return (
    <>
        <SearchBar onSearchTextChange={setContentCard} onIsSearch={setIsSearch} />
        <SearchContent contentCard={contentCard} isSearch={isSearch} />
    </>
  );
}