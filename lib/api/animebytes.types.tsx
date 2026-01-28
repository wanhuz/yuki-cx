// types/animeBytes.ts
export interface ABTorrent {
  ID: number;
  EditionData: {
    EditionTitle: string;
  };
  Link: string;
  Property: string;
  Size: number;
  Snatched: number;
  Seeders: number;
  Leechers: number;
  UploadTime: string;
  FileList: {
    filename: string;
    size: number;
  }[];
}

export interface ABGroup {
  ID: number;
  CategoryName: string;
  FullName: string;
  GroupName: string;
  SeriesID: string;
  SeriesName: string;
  Artists: string | null;
  Year: string;
  Image: string;
  Synonymns: string[];
  SynonymnsV2: {
    Japanese: string;
    Romaji: string;
    Alternative: string;
  };
  Snatched: number;
  Comments: number;
  Links: {
    AniDB?: string;
    ANN?: string;
    Wikipedia?: string;
    MAL?: string;
  };
  Votes: number;
  AvgVote: number;
  Associations: string | null;
  Description: string;
  DescriptionHTML: string;
  EpCount: number;
  StudioList: string;
  PastWeek: number;
  Incomplete: boolean;
  Ongoing: boolean;
  Tags: string[];
  Torrents: ABTorrent[];
}

export interface ABSearchResponse {
  Results: number;
  Pagination: {
    Current: number;
    Max: number;
    Limit: {
      Min: number;
      Coerced: number;
      Max: number;
    };
  };
  Matches: number;
  Groups: ABGroup[];
}

export interface ABSearchQueryParams {
  title: string;
  type: string;
  maxItem: number;
  hentai?: number;   // default = 0
  sort?: string;     // default = "relevance"
  way?: string;      // default = "asc"
  airing?: number;   // default = -1
  epcount?: number;  // default = -1
  epcount2?: number; // default = -1
  year?: number;    // default = -1
};
