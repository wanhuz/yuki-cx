import FeaturedAnime from "@/components/FeaturedAnime";
import { getFeaturedAnime } from "@/lib/app/home";

export default async function HomeComponent() {
    const featuredAnimes = await getFeaturedAnime();

    return (
      <>
        <FeaturedAnime images={featuredAnimes.map(a => ({
          banner_url: a.banner_url,
          logo_url: a.logo_url
        }))} />
      </>
    );
}