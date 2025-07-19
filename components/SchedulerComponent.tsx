"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SchedulerContent from "@/components/SchedulerContent";

export default function SearchComponent() {
  const [contentCard, setContentCard] = useState<Anime[]>([]);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  return (
    <>
        <SearchBar onSearchTextChange={setContentCard} onIsSearch={setIsSearch} />
        {<SchedulerContent contentCard={contentCard} isSearch={isSearch} />}
    </>
  );
}