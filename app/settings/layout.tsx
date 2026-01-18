"use client";

import SettingsSidebar from "@/components/SettingsSidebar";
import { useState } from "react";
import { createContext, useContext } from "react";

type SettingsContextType = {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return ctx;
}

export default function Page({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [activeIndex, setActiveIndex] = useState(-1);
    
    return (
      <SettingsContext.Provider value={{ activeIndex, setActiveIndex }}>
        <main className="container flex flex-row w-80 sm:w-full mx-auto sm:items-start mb-10 mt-10 gap-8">
          <SettingsSidebar
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
          <div className="bg-gray-100 rounded-md flex flex-col h-5/6 w-full border-2">
            {children}
          </div>
        </main>
      </SettingsContext.Provider>
    );
  }
