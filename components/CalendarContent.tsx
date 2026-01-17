import { useEffect, useState } from "react";
import { getUpcomingAnime } from "@/lib/api/scheduler";
import EpisodeCalendarCard from "./EpisodeCalendarCard";
import EpisodeCalendarCardContainer from "./EpisodeCalendarCardContainer";

 export default function CalendarContent() {
  const [listContainers, setListContainers] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchAndSetCards = async () => {
      const result = await getUpcomingAnime();

      const episodes = result.flatMap(entry => {
        const ref = entry.references?.[0];
        if (!ref) return [];

        return ref.episodes.map(episode => ({
          entry,
          ref,
          episode,
        }));
      });

      episodes.sort(
        (a, b) =>
          new Date(a.episode.episode_date ?? 0).getTime() -
          new Date(b.episode.episode_date ?? 0).getTime()
      );

      const containers: JSX.Element[] = [];

      let currentDateKey = "";
      let currentCards: JSX.Element[] = [];
      let currentAirdate: Date | null = null;

      for (const { entry, ref, episode } of episodes) {
        const airdate = episode.episode_date ?? new Date();
        const dateKey = airdate.toISOString().split("T")[0];

        // New date → push previous container
        if (dateKey !== currentDateKey && currentCards.length > 0) {
          containers.push(
            <EpisodeCalendarCardContainer
              key={currentDateKey}
              airdate={currentAirdate!}
              cards={currentCards}
            />
          );

          currentCards = [];
        }

        currentDateKey = dateKey;
        currentAirdate = airdate;

        currentCards.push(
          <EpisodeCalendarCard
            key={`${entry.ab_id}-${episode.episode_number}`}
            id={entry.ab_id}
            series_name={ref.series_name}
            summary={ref.summary}
            tags={ref.tags}
            poster={ref.poster_url}
            number={episode.episode_number}
            title={episode.episode_title || ""}
          />
        );
      }

      // Push last group
      if (currentCards.length > 0 && currentAirdate) {
        containers.push(
          <EpisodeCalendarCardContainer
            key={currentDateKey}
            airdate={currentAirdate}
            cards={currentCards}
          />
        );
      }

      setListContainers(containers);
    };

    fetchAndSetCards();

    const interval = setInterval(fetchAndSetCards, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container px-5 sm:px-5 md:px-0 sm:mx-auto flex flex-col gap-6 mb-8">
      {listContainers}
    </div>
  );
}

  
