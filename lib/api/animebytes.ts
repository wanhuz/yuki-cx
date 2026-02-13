"use server";

import { ABSearchResponse, ABSearchQueryParams, ABGroup  } from "../interface/animebytes.js";


const ANIMEBYTES_URL = "https://animebytes.tv/scrape.php"

type ABStatus = {
  success: boolean;
  status: {
    site?: { status: number };
    tracker?: { status: number };
  };
};

export async function search({passkey, username} : {passkey: string, username: string}, series_name: string, type: string): Promise<ABGroup[]> {
  const search_query_params = { title: series_name, type: type, maxItem: 25 };
  const search_query = generateSearchQuery( {passkey, username} , search_query_params);

  const data = await fetch(search_query);

  const search_result: ABSearchResponse = await data.json();

  return search_result.Groups;
}
/*
    This is pretty hackish way of getting anime metadata from AB to display anime page, as AB API didn't provide direct way to do it.
    Works by first searching title and then matching the ID from the search result link
    As a result, link to the page need to have title and ID
*/
export async function getAnime({passkey, username} : {passkey: string, username: string}, anime_title: string, id : number): Promise<ABGroup | null> {
    const search_query_params = {
      title: anime_title, 
      type: "DEFAULT", 
      hentai: 2,
      maxItem: 3
    };

    const search_query = generateSearchQuery( {passkey, username} , search_query_params);

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

function generateSearchQuery({passkey, username} : {passkey: string, username: string} , {
    title,
    type,
    maxItem,
    hentai = 0,
    sort = "relevance",
    way = "desc",
    airing = -1, 
    epcount = -1,
    epcount2 = -1,
    year = -1
    }: ABSearchQueryParams
    ) {
    const authParams = {
        torrent_pass: passkey,
        username: username,
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
        year: year === -1 ? "" : String(year)
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

export async function getAnimes({passkey, username} : {passkey: string, username: string}, ABSearchQueryParams: ABSearchQueryParams): Promise<ABGroup[] | null> {

    const search_query = generateSearchQuery({passkey, username}, ABSearchQueryParams);

    const data = await fetch(search_query);

    let search_result;
    try {
      search_result = await data.json();

      const search_result_groups = search_result["Groups"];
         
  return search_result_groups;
    } catch (error) {
      console.error('Error:', error);
    }

    return null;
    
}
