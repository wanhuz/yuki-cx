
import FeaturedAnime from "@/components/FeaturedAnime";
import { FeaturedAnimeBanner, getFeaturedAnime, getTrendingAnime } from "@/lib/app/home";
import HomeCardContent from "./HomeCardContent";


export default async function HomeComponent() {
    const featuredAnimes: FeaturedAnimeBanner[] | null = await getFeaturedAnime();
    const trendingAnime = await getTrendingAnime();

    return (
      <main className="flex flex-col gap-5">
        {featuredAnimes ? <FeaturedAnime images={featuredAnimes.map(a => ({
          series_url: a.series_url,
          banner_url: a.banner_url,
          logo_url: a.logo_url
        }))} /> : null}

        {trendingAnime ? <HomeCardContent title={"Winter 2026"} contentCard={trendingAnime}/> : null}
      </main>
    );
}