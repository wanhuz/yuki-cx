"use client";

import SettingsSidebar from "@/components/SettingsSidebar";
import { useState } from "react";
import { SettingsContext } from "./SettingsContext";

export default function Page({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [activeIndex, setActiveIndex] = useState(-1);
    
    return (
      <SettingsContext.Provider value={{ activeIndex, setActiveIndex }}>
        <main className="container flex flex-col md:flex-row w-80 sm:w-full mx-auto sm:items-start mb-10 mt-10 gap-8">
          <SettingsSidebar
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
          <div className="bg-gray-100 rounded-md flex flex-col h-5/6 w-full sm:w-5/6 md:w-full mx-auto md:mx-0 border-2">
            {children}
          </div>
        </main>
      </SettingsContext.Provider>
    );
  }
