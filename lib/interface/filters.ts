type FilterValue = 'neutral' | 'include' | 'exclude';

interface FilterState {
  [key: string]: FilterValue;
}

interface Filters {
  quality?: FilterState;
  subgroup?: FilterState;
  extension?: FilterState;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type FilterCategory = keyof Filters;