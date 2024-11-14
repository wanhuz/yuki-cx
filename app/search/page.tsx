"use client";

import SearchBar from "@/components/SearchBar";
import Content from "@/components/Content";
import { useState } from "react";


export default function Page() {
    const [contentCard, setContentCard] = useState<Anime[]>([]);
  
    return (
      <div className="container-md">
        <SearchBar onSearchTextChange={setContentCard}/>
        <Content contentCard={contentCard}/>
      </div>
    );
  }