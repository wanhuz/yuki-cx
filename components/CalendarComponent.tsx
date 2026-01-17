"use client";

import { useState } from "react";
import CalendarContent from "./CalendarContent";

export default function SchedulerComponent() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);

  return (
    <>
        {<CalendarContent searchQuery={searchQuery} isSearch={isSearch} />}
    </>
  );
}