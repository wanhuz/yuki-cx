export type FilterOption = string;

export interface SearchFiltersState {
  type: FilterOption;
  status: FilterOption;
  count: FilterOption;
}

export interface SearchFilterProps {
  typeOptions?: FilterOption[];
  statusOptions?: FilterOption[];
  countOptions?: FilterOption[];
  initialFilters?: Partial<SearchFiltersState>;
  onApply?: (filters: SearchFiltersState) => void;
  onCancel?: () => void;
}