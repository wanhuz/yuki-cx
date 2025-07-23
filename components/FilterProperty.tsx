'use client';

import { useState} from 'react';
import { PopoverPanel } from '@headlessui/react';
import { RawFilters } from '@/lib/interface/rawfilter';

interface FilterPropertyProps {
  filters?: RawFilters;
  onFiltersChange?: (filters: Filters) => void;
}

const FilterProperty: React.FC<FilterPropertyProps> = ({
  filters: { quality = [], subgroup = [], extension = [] } = {},
  onFiltersChange
}) => {
  const [filters, setFilters] = useState<Filters>(() => {
    const init = (items: string[]) => {
      const obj: FilterState = {};
      items.forEach(item => {
        obj[item] = 'neutral';
      });
      return obj;
    };

    return {
      quality: quality.length ? init(quality) : undefined,
      subgroup: subgroup.length ? init(subgroup) : undefined,
      extension: extension.length ? init(extension) : undefined,
    };
  });

  const toggleFilter = (category: FilterCategory, item: string) => {
    setFilters(prev => {
      const current = prev[category]?.[item] ?? 'neutral';
      const next: FilterValue =
        current === 'neutral' ? 'include' :
        current === 'include' ? 'exclude' :
        'neutral';

      const updatedCategory: FilterState = {
        ...prev[category],
        [item]: next,
      };

      const newFilters: Filters = {
        ...prev,
        [category]: updatedCategory,
      };

      onFiltersChange?.(newFilters);
      return newFilters;
    });
  };

  const getButtonStyle = (state: FilterValue): string => {
    switch (state) {
      case 'include':
        return 'bg-green-200 border-green-400 text-green-800';
      case 'exclude':
        return 'bg-red-200 border-red-400 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200';
    }
  };

  const renderGroup = (title: string, items: string[], category: FilterCategory) => (
    <div className="mb-4">
      <h3 className="text-xs font-medium mb-2 text-gray-600">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <button
            key={item}
            onClick={() => toggleFilter(category, item)}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${getButtonStyle(
              filters[category]?.[item] ?? 'neutral'
            )}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <PopoverPanel className="absolute z-50 mt-2 left-1/2 transform -translate-x-1/2 w-72 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <h2 className="text-sm font-semibold mb-5">Filter Settings</h2>
      {quality.length > 0 && renderGroup('Quality', quality, 'quality')}
      {subgroup.length > 0 && renderGroup('Subgroup', subgroup, 'subgroup')}
      {extension.length > 0 && renderGroup('Extension', extension, 'extension')}
    </PopoverPanel>
  );
};

export default FilterProperty;
