import { FanartItem, FanartResponse, SeasonPoster, TvThumb } from "./fanarttv.types";



export async function getFanartTV(tvdb_id : number) {
    const apiKey = process.env.FANARTTV_APIKEY;

    const url = `https://webservice.fanart.tv/v3.2/tv/${tvdb_id}?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const season_poster = getOneBanner(data);

        return season_poster;
    } catch (error) {
        console.error('Error:', error);
    }
}

function pickBest(
  items: FanartItem[] | undefined,
  filter?: (item: FanartItem) => boolean
): FanartItem | undefined {
  if (!items || items.length === 0) return undefined;

  const filtered = filter ? items.filter(filter) : items;

  return filtered
    .sort((a, b) => {
      // prefer EN
      if (a.lang === "en" && b.lang !== "en") return -1;
      if (b.lang === "en" && a.lang !== "en") return 1;

      // then by likes
      return Number(b.likes) - Number(a.likes);
    })[0];
}

function pickBestThumb(items: TvThumb[] | undefined): TvThumb | undefined {
  if (!items || items.length === 0) return undefined;

  return items.sort(
    (a, b) => Number(b.likes) - Number(a.likes)
  )[0];
}

function getOneBanner(data: FanartResponse): SeasonPoster {
  const hdtvlogo = pickBest(data.hdtvlogo);

  const seasonposter =
    pickBest(
      data.seasonposter,
      item => typeof item.season === "string"
    ) ??
    pickBestThumb(data.tvthumb);

  return {
    hdtvlogo,
    seasonposter
  };
}