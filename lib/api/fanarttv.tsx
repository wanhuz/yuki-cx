import { FanartItem, FanartResponse, SeasonPoster, TvThumb } from "../interface/fanarttv";



export async function getFanartTV(tvdb_id : number, season_number: number) {
    const apiKey = process.env.FANARTTV_APIKEY;

    const url = `https://webservice.fanart.tv/v3.2/tv/${tvdb_id}?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data : FanartResponse = await response.json();

        const season_poster = getOneBanner(data, season_number);

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

function getOneBanner(data: FanartResponse, season_number: number): SeasonPoster {
  const hdtvlogo = pickBest(data.hdtvlogo);

  const seasonposter =
    pickBest(
      data.seasonposter,
      item => item.season === season_number.toString()
    ) ??
    pickBestThumb(data.tvthumb);

  return {
    hdtvlogo,
    seasonposter
  };
}