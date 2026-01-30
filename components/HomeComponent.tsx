
import FeaturedAnime from "@/components/FeaturedAnime";
import { FeaturedAnimeBanner, getFeaturedAnime, getNewMovieRelease, getSeasonalAnime, getTrendingAnimeThisYear, getYouMightLike } from "@/lib/app/home";
import HomeCardContent from "./HomeCardContent";


export default async function HomeComponent() {
    const featuredAnimes: FeaturedAnimeBanner[] | null = await getFeaturedAnime();
    const seasonalAnime = await getSeasonalAnime();
    const trendingThisYearAnime = await getTrendingAnimeThisYear();
    const youMightLikeAnime = await getYouMightLike();
    const movieNewReleaseAnime = await getNewMovieRelease();

    return (
      <main className="flex flex-col gap-6">
        {featuredAnimes ? <FeaturedAnime images={featuredAnimes.map(a => ({
          series_url: a.series_url,
          banner_url: a.banner_url,
          logo_url: a.logo_url
        }))} /> : null}

        <div className="flex flex-col">

          {seasonalAnime ? <HomeCardContent title={"Winter 2026"} contentCard={seasonalAnime}/> : null}

          {trendingThisYearAnime ? <HomeCardContent title={"Trending This Year"} contentCard={trendingThisYearAnime}/> : null}

          {movieNewReleaseAnime ? <HomeCardContent title={"New Movie Release"} contentCard={movieNewReleaseAnime}/> : null}

          {youMightLikeAnime ? <HomeCardContent title={"All Time Favorite"} contentCard={youMightLikeAnime}/> : null}

        </div>
      </main>
    );
}