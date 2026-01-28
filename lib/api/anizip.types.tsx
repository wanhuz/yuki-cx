export interface AniZipTitle {
  "x-jat"?: string;
  en?: string | null;
  ja?: string;
  bg?: string;
  "zh-Hans"?: string;
  de?: string;
  es?: string;
}

export interface AniZipEpisode {
  tvdbShowId?: number;
  tvdbId?: number;
  seasonNumber?: number;
  episodeNumber?: number;
  absoluteEpisodeNumber?: number;
  title: AniZipTitle;
  airDate?: string;
  airDateUtc?: string;
  runtime?: number;
  overview?: string;
  image?: string;
  episode: string; // episode number as string, can be "1", "2", ..., "S1"
  anidbEid?: number;
  length?: number;
  airdate?: string;
  rating?: string;
  summary?: string;
}

export interface AniZipImage {
  coverType: string; // Banner, Poster, Fanart, Clearlogo
  url: string;
}

export interface AniZipMappings {
  animeplanet_id?: string;
  kitsu_id?: number;
  mal_id?: number;
  type?: string;
  anilist_id?: number;
  anisearch_id?: number;
  anidb_id?: number;
  notifymoe_id?: number | null;
  livechart_id?: number;
  thetvdb_id?: number;
  imdb_id?: string;
  themoviedb_id?: number;
}

export interface AniZipSeries {
  titles: AniZipTitle;
  episodes: Record<string, AniZipEpisode>; // keys can be "1", "2", ..., "S1"
  episodeCount: number;
  specialCount?: number;
  images: AniZipImage[];
  mappings: AniZipMappings;
}

export type AniZipTVDBData = {
    tvdb_id: number | null;
    season_number: number | null;
    title_en: string | null;
}