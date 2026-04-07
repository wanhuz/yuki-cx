type FilterOption = string;

interface SearchFiltersState {
  type: FilterOption;
  status: FilterOption;
  count: FilterOption;
}

interface SearchFilterProps {
  typeOptions?: FilterOption[];
  statusOptions?: FilterOption[];
  countOptions?: FilterOption[];
  initialFilters?: Partial<SearchFiltersState>;
  onApply?: (filters: SearchFiltersState) => void;
  onCancel?: () => void;
}