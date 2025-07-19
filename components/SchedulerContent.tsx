import { useEffect, useState } from "react";
import SeriesSchedulerCard from "./SeriesSchedulerCard";
import { getAnimeInScheduler } from "@/lib/api/scheduler";


 export default function Content({ contentCard, isSearch }: { contentCard: Anime[], isSearch: boolean }) {
  const [listCards, setListCards] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchAndSetCards = async () => {
      const result = await getAnimeInScheduler();

      const cards = result.map((entry: { ab_id: number; last_fetched_episode: number; last_fetched_at: Date; filter_property: string; references: { series_name: string; studio_name: string; summary: string; tags: string; poster_url: string }[] }) => (
        <SeriesSchedulerCard
          key={entry.ab_id}
          id={entry.ab_id}
          series_name={entry.references[0].series_name}
          studio_name={entry.references[0].studio_name}
          summary={entry.references[0].summary}
          tags={entry.references[0].tags}
          poster={entry.references[0].poster_url}
          filter_property={entry.filter_property}
          last_fetched_episode={entry.last_fetched_episode}
          last_fetched_at={entry.last_fetched_at}
        />
      ));
      setListCards(cards);
    };

    fetchAndSetCards();

    const interval = setInterval(fetchAndSetCards, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container px-5 sm:px-0 sm:mx-auto flex flex-wrap flex-1 md:gap-5">
      {isSearch ? (
        // Show Skeleton
        <div className="flex flex-wrap gap-3">
          {[...Array(15)].map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="w-32 h-48 bg-gray-300 animate-pulse rounded-md"></div>
              <div className="mt-2 h-3 bg-gray-300 w-32 animate-pulse"></div>
              <div className="h-3 mb-4 bg-gray-300 w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : !isSearch && listCards.length < 1 ? (
        <div className="text-center text-md  text-gray-700">
          No results found
        </div>
      ) : !isSearch && listCards.length > 0 ? (
        listCards
      )
      : null}
    </div>
  );
}

  
