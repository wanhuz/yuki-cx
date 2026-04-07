"use client";

import { useState } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Image from "next/image";
import { FilterOption, SearchFilterProps, SearchFiltersState } from "@/lib/app/search-filter";

const DEFAULT_TYPE_OPTIONS = ["All", "TV Series", "Movie", "Special"];
const DEFAULT_STATUS_OPTIONS = ["Any", "Ongoing", "Finished"];
const DEFAULT_COUNT_OPTIONS = ["25", "50", "100"];

const SearchFilter: React.FC<SearchFilterProps> = ({
  typeOptions = DEFAULT_TYPE_OPTIONS,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  countOptions = DEFAULT_COUNT_OPTIONS,
  initialFilters = {},
  onApply
}) => {
  const [filters, setFilters] = useState<SearchFiltersState>({
    type: initialFilters.type ?? typeOptions[0],
    status: initialFilters.status ?? statusOptions[0],
    count: initialFilters.count ?? countOptions[0],
  });

  const [openDropdown, setOpenDropdown] = useState<keyof SearchFiltersState | null>(null);

  const handleSelect = (key: keyof SearchFiltersState, value: FilterOption) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  };

  const handleApply = () => {
    onApply?.(filters);
  };

  const handleReset = () => {
    onApply?.({
      type: typeOptions[0],
      status: statusOptions[0],
      count: countOptions[0],
    })
  };

  const rows: { label: string; key: keyof SearchFiltersState; options: FilterOption[] }[] = [
    { label: "Type", key: "type", options: typeOptions },
    { label: "Status", key: "status", options: statusOptions },
    { label: "Count", key: "count", options: countOptions },
  ];

  return (
    <Popover className="relative inline-block ms-3">
      <PopoverButton className="flex items-center gap-1.5 px-3 py-2.5 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors outline-none">
        Filters
        <Image src="/filter.png" alt="Filter"
          width={16}
          height={16}
          className="w-4 h-4"/>
      </PopoverButton>

      <PopoverPanel className="absolute z-50 mt-2 right-1 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-visible">
      <div className="px-5 pt-4 pb-2">
        <h2 className="text-md text-gray-700">
          Search filters
        </h2>
      </div>

      <div className="px-5 py-6 space-y-4">
        {rows.map(({ label, key, options }) => (
          <div key={key} className="flex items-center justify-between relative">
            <span className="text-sm text-gray-700 w-16">{label}</span>

            <button
              onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors min-w-[100px] justify-between"
            >
              <span>{filters[key]}</span>
              <Image
                alt="Down arrow"
                src="/down-arrow.png"
                width={16}
                height={16}
                className="w-4 h-4 transition-transform"
                style={{ transform: openDropdown === key ? "rotate(180deg)" : "" }}
              />
            </button>

            {openDropdown === key && (
              <div className="absolute top-7 right-0 z-10 bg-white rounded-lg border border-gray-200 shadow-md py-1 flex flex-col">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(key, option)}
                    className={`min-w-[100px] text-left px-3 py-1.5 text-sm transition-colors ${
                      filters[key] === option
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 mt-6" />


      <div className="flex items-center justify-end gap-2 px-4 py-3">
        <button
          onClick={handleReset}
          className="px-4 py-1.5 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-1.5 text-sm rounded-md bg-sky-500 text-white hover:bg-sky-600 transition-colors"
        >
          Apply
        </button>
      </div>
      </PopoverPanel>
    </Popover>
  );
};

export default SearchFilter;