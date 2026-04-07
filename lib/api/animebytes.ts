"use server";

import { ABSearchResponse, ABSearchQueryParams, ABGroup, ABStatus, ABAuth  } from "../interface/animebytes.js";

const ANIMEBYTES_URL = "https://animebytes.tv/scrape.php"

export async function search(ab_auth : ABAuth, search_query_params: ABSearchQueryParams): Promise<ABGroup[]> {

  const search_query = generateSearchQuery(ab_auth, search_query_params);

  const data = await fetch(search_query);

  const search_result: ABSearchResponse = await data.json();

  return search_result.Groups;
}
/*
    This is pretty hackish way of getting anime metadata from AB to display anime page, as AB API didn't provide direct way to do it.
    Works by first searching title and then matching the ID from the search result link
    As a result, link to the page need to have title and ID
*/
export async function getAnime(ab_auth: ABAuth, anime_title: string, id : number): Promise<ABGroup | null> {
    const search_query_params = {
      title: anime_title, 
      type: "DEFAULT", 
      hentai: 2,
      maxItem: 3
    };

    const search_query = generateSearchQuery( ab_auth , search_query_params);

    const data = await fetch(search_query);

    const search_result: ABSearchResponse = await data.json();

    if (!search_result.Groups) {
        return null;
    }
    
    const search_result_groups = search_result.Groups;

    for (const result of search_result_groups) {
        if (result.ID === id) {
            return result;
        }
    }
    
    const anime_data = search_result_groups[0] // Temporary default to first item if not found;

    return anime_data;
}

function generateSearchQuery(ab_auth: ABAuth, {
    title,
    type,
    maxItem,
    hentai = 0,
    sort = "relevance",
    way = "desc",
    airing = -1, 
    epcount = -1,
    epcount2 = -1,
    year = -1,
    tags = ""
    }: ABSearchQueryParams
    ) {
    const authParams = {
        torrent_pass: ab_auth.passkey,
        username: ab_auth.username,
    };


    const animeTypeMap: Record<string, Record<string, string>> = {
        TV_SERIES:  { "anime[tv_series]": "1" },
        TV_SPECIAL: { "anime[tv_special]": "1" },
        OVA:        { "anime[ova]": "1" },
        ONA:        { "anime[ona]": "1" },
        MOVIE:      { "anime[movie]": "1" },
        DEFAULT: {
            "anime[tv_series]": "1",
            "anime[tv_special]": "1",
            "anime[movie]": "1",
            "anime[ova]": "1",
            "anime[ona]": "1",
        },
    };

    const params = new URLSearchParams({
        torrent_pass: authParams.torrent_pass ?? "",
        username: authParams.username ?? "",
        hentai: String(hentai),
        airing: airing === -1 ? "" : String(airing),
        sort: String(sort),
        way: String(way),
        searchstr: decodeURIComponent(title),
        ...animeTypeMap[type] ?? animeTypeMap.TV_SERIES,
        type: "anime",
        search_type: "title",
        limit: String(maxItem),
        epcount: epcount === -1 ? "" : String(epcount),
        epcount2: epcount2 === -1 ? "" : String(epcount2),
        year: year === -1 ? "" : String(year),
        tags: tags
    });


    const search_query = `${ANIMEBYTES_URL}?${params.toString()}`;

    return search_query;
}

export async function animeBytesStatusHealth() {
  try {
    const res = await fetch(
      "https://status.animebytes.tv/api/status",
      { cache: "no-store" }
    );

    if (!res.ok) {
      return { ok: false, reason: "HTTP_ERROR" };
    }

    const data = (await res.json()) as ABStatus;

    if (!data.success) {
      return { ok: false, reason: "API_ERROR" };
    }

    const siteStatus = data.status?.site?.status;

    if (siteStatus === 0) {
      return { ok: false, reason: "SITE_OFFLINE" };
    }

    if (siteStatus === 2) {
      return { ok: false, reason: "MAINTENANCE" };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, reason: "UNREACHABLE" };
  }
}

export async function getAnimes(
  ab_auth: ABAuth,
  ABSearchQueryParams: ABSearchQueryParams
): Promise<ABGroup[] | null> {
  const search_query = generateSearchQuery(ab_auth, ABSearchQueryParams);

  try {
    const response = await fetch(search_query);

    if (!response.ok) {
      console.error(`Fetch failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const search_result: ABSearchResponse | null = await response.json().catch(() => null);

    if (!search_result || !search_result.Groups) {
      console.warn("No groups found in search result");
      return null;
    }

    return search_result.Groups;
  } catch (err) {
    console.error("Error fetching or parsing data:", err);
    return null;
  }
}
