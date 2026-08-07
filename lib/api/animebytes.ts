import { ABSearchResponse, ABSearchQueryParams, ABGroup, ABAuth  } from "../interface/animebytes.js";

const ANIMEBYTES_URL = "https://animebytes.tv/scrape.php"

/*
    This is pretty hackish way of getting anime metadata from AB to display anime page, as AB API didn't provide direct way to do it.
    Works by first searching title and then matching the ID from the search result link
    As a result, link to the page need to have title and ID
*/
export async function getAnime(ab_auth: ABAuth, anime_title: string, id: number): Promise<ABGroup | null> {

  const search = async (maxItem: number): Promise<ABGroup | null> => {
    const params = {
      title: anime_title,
      type: "DEFAULT",
      hentai: 2,
      maxItem
    };

    const query = generateSearchQuery(ab_auth, params);
    const res = await fetch(query);
    const json: ABSearchResponse = await res.json();

    if (!json.Groups) return null;

    for (const result of json.Groups) {
      if (result.ID === id) {
        return result;
      }
    }

    return null;
  };

  // First attempt - faster with small result
  let result = await search(3);
  if (result) return result;

  // Retry with bigger result set if anime is not found
  result = await search(40);
  if (result) return result;

  return null;
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

    // This function is for backend, it must be the same as /app/animebytes.tsx
    const animeTypeMap: Record<string, Record<string, string>> = {
        TV_SERIES:  { "anime[tv_series]": "1" },
        SPECIAL: { 
          "anime[tv_special]": "1",
          "anime[bd_special]": "1",
          "anime[dvd_special]": "1",
          "anime[ova]": "1",
          "anime[ona]": "1",
        },
        OVA:        { "anime[ova]": "1" },
        ONA:        { "anime[ona]": "1" },
        MOVIE:      { "anime[movie]": "1" },
        DEFAULT: {
            "anime[tv_series]": "1",
            "anime[tv_special]": "1",
            "anime[bd_special]": "1",
            "anime[dvd_special]": "1",
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