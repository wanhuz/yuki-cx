export interface FanartItem {
  id: string;
  lang: string;
  url: string;
  likes: string;
  season?: string;
};

export interface TvThumb {
  id: string;
  url: string;
  likes: string;
};

export interface FanartResponse {
  hdtvlogo?: FanartItem[];
  seasonposter?: FanartItem[];
  tvthumb?: TvThumb[];
};

export interface SeasonPoster {
  hdtvlogo?: FanartItem;
  seasonposter?: FanartItem | TvThumb;
};