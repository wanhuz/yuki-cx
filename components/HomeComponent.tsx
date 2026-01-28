import FeaturedAnime from "@/components/FeaturedAnime";
import { FeaturedAnimeBanner, getFeaturedAnime } from "@/lib/app/home";

export default async function HomeComponent() {
    const featuredAnimes: FeaturedAnimeBanner[] | null = await getFeaturedAnime();

    return (
      <>
        {featuredAnimes ? <FeaturedAnime images={featuredAnimes.map(a => ({
          series_url: a.series_url,
          banner_url: a.banner_url,
          logo_url: a.logo_url
        }))} /> : null}
      </>
    );
}