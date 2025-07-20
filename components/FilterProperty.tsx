'use client';

import { Popover } from '@headlessui/react';
import { useState, useEffect } from 'react';

type FilterState = 'neutral' | 'include' | 'exclude';

interface Filters {
  [category: string]: {
    [item: string]: FilterState;
  };
}

interface FilterPropertyProps {
  quality?: string[];
  subgroup?: string[];
  extension?: string[];
  onFiltersChange?: (filters: Filters) => void;
}

const FilterProperty: React.FC<FilterPropertyProps> = ({
  quality = [],
  subgroup = [],
  extension = [],
  onFiltersChange
}) => {
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    const initialFilters: Filters = {};
    if (quality.length > 0) {
      initialFilters.quality = {};
      quality.forEach(item => {
        initialFilters.quality[item] = 'neutral';
      });
    }
    if (subgroup.length > 0) {
      initialFilters.subgroup = {};
      subgroup.forEach(item => {
        initialFilters.subgroup[item] = 'neutral';
      });
    }
    if (extension.length > 0) {
      initialFilters.extension = {};
      extension.forEach(item => {
        initialFilters.extension[item] = 'neutral';
      });
    }
    setFilters(initialFilters);
  }, [quality, subgroup, extension]);

  const toggleFilter = (category: string, item: string): void => {
    setFilters(prev => {
      const current = prev[category]?.[item] || 'neutral';
      const next: FilterState =
        current === 'neutral' ? 'include' : current === 'include' ? 'exclude' : 'neutral';

      const newFilters = {
        ...prev,
        [category]: {
          ...prev[category],
          [item]: next
        }
      };

      onFiltersChange?.(newFilters);
      return newFilters;
    });
  };

  const getButtonStyle = (state: FilterState): string => {
    switch (state) {
      case 'include':
        return 'bg-green-200 border-green-400 text-green-800';
      case 'exclude':
        return 'bg-red-200 border-red-400 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200';
    }
  };

  return (
        <>

      <Popover.Panel className="absolute z-50 mt-2 left-1/2 transform -translate-x-1/2 w-72 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <h2 className="text-sm font-semibold mb-5">Filter Settings</h2>

        {quality.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-medium mb-2 text-gray-600">Quality</h3>
            <div className="flex flex-wrap gap-2">
              {quality.map(item => (
                <button
                  key={item}
                  onClick={() => toggleFilter('quality', item)}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${getButtonStyle(
                    filters.quality?.[item] || 'neutral'
                  )}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {subgroup.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-medium mb-2 text-gray-600">Subgroup</h3>
            <div className="flex flex-wrap gap-2">
              {subgroup.map(item => (
                <button
                  key={item}
                  onClick={() => toggleFilter('subgroup', item)}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${getButtonStyle(
                    filters.subgroup?.[item] || 'neutral'
                  )}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {extension.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-medium mb-2 text-gray-600">Extension</h3>
            <div className="flex flex-wrap gap-2">
              {extension.map(item => (
                <button
                  key={item}
                  onClick={() => toggleFilter('extension', item)}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${getButtonStyle(
                    filters.extension?.[item] || 'neutral'
                  )}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </Popover.Panel>
    </>
  );
};

export default FilterProperty;
