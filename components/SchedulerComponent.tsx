"use client";

import { useState } from "react";
import SchedulerSearchBar from "@/components/SchedulerSearchBar";
import SchedulerContent from "@/components/SchedulerContent";
import { SchedulerFetchMissingButton } from "./SchedulerFetchMissingButton";

export default function SchedulerComponent() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);

  return (
    <>
        <div className="container mx-auto px-3 sm:px-1  md:px-0 flex flex-row md:gap-3">
          <SchedulerSearchBar onSearchTextChange={setSearchQuery} onIsSearch={setIsSearch} />
          <SchedulerFetchMissingButton />
        </div>
        {<SchedulerContent searchQuery={searchQuery} isSearch={isSearch} />}
    </>
  );
}