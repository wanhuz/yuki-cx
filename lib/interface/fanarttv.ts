export interface FanartItem {
  id: string;
  lang: string;
  url: string;
  likes: string;
  season?: string;
  added: string;
};

export interface TvThumb {
  id: string;
  url: string;
  likes: string;
};

export interface FanartResponse {
  hdtvlogo?: FanartItem[];
  seasonposter?: FanartItem[];
  showbackground?: FanartItem[];
  tvposter?: FanartItem[];
  tvthumb?: TvThumb[];
};

export interface SeasonPoster {
  hdtvlogo?: FanartItem;
  seasonposter?: FanartItem | TvThumb;
};