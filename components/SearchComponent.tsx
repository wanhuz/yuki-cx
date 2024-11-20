"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchContent from "@/components/SearchContent";

export default function SearchComponent() {
  const [contentCard, setContentCard] = useState<Anime[]>([]);

  return (
    <>
        <SearchBar onSearchTextChange={setContentCard} />
        <SearchContent contentCard={contentCard} />
    </>
  );
}