import { useEffect, useState } from "react";
import { getUpcomingAnime } from "@/lib/api/scheduler";
import { buildDailyContainers, buildMonthlyContainers} from "../lib/app/calendar";

export default function CalendarContent() {
  const [listContainers, setListContainers] = useState<JSX.Element[]>([]);

  useEffect(() => {

    const fetchAndSetCards = async () => {
      const result = await getUpcomingAnime();

    const episodes = result
      .flatMap(entry => {
        const ref = entry.references?.[0];
        if (!ref) return [];

        return ref.episodes.map(episode => ({
          entry: {
            ab_id: entry.ab_id,
            series_name: entry.series_name,
          },
          ref: {
            series_name: ref.series_name,
            studio_name: ref.studio_name,
            summary: ref.summary,
            tags: ref.tags,
            poster_url: ref.poster_url,
            airing_time: ref.airing_time, 
          },
          episode: {
            episode_number: episode.episode_number,
            episode_title: episode.episode_title ?? "",
            episode_date: episode.episode_date,
          },
        }));
      })
      .sort(
        (a, b) =>
          a.episode.episode_date.getTime() -
          b.episode.episode_date.getTime()
      );

      const daily = buildDailyContainers(episodes);
      const monthly = buildMonthlyContainers(daily);

      setListContainers(monthly);
    };

    fetchAndSetCards();
    const interval = setInterval(fetchAndSetCards, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container px-5 sm:px-5 md:px-0 sm:mx-auto flex flex-col gap-6 my-8">
      {listContainers}
    </div>
  );
}
