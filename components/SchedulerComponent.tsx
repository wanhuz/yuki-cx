"use client";

import { useState } from "react";
import SchedulerSearchBar from "@/components/SchedulerSearchBar";
import SchedulerContent from "@/components/SchedulerContent";

export default function SchedulerComponent() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);

  return (
    <>
        <SchedulerSearchBar onSearchTextChange={setSearchQuery} onIsSearch={setIsSearch} />
        {<SchedulerContent searchQuery={searchQuery} isSearch={isSearch} />}
    </>
  );
}