export type FanartItem = {
  id: string;
  lang: string;
  url: string;
  likes: string;
  season?: string;
};

export type TvThumb = {
  id: string;
  url: string;
  likes: string;
};

export type FanartResponse = {
  hdtvlogo?: FanartItem[];
  seasonposter?: FanartItem[];
  tvthumb?: TvThumb[];
};

export type SeasonPoster = {
  hdtvlogo?: FanartItem;
  seasonposter?: FanartItem | TvThumb;
};