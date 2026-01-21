import { useEffect, useState } from "react";
import { getUpcomingAnime } from "@/lib/api/scheduler";
import { buildDailyContainers, buildMonthlyContainers} from "../lib/app/calendarutils";

export default function CalendarContent() {
  const [listContainers, setListContainers] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchAndSetCards = async () => {
      const result = await getUpcomingAnime();

      const episodes = result
        .flatMap(entry => {
          const ref = entry.references?.[0];
          if (!ref) return [];
          return ref.episodes.map(episode => ({ entry, ref, episode }));
        })
        .sort(
          (a, b) =>
            new Date(a.episode.episode_date ?? 0).getTime() -
            new Date(b.episode.episode_date ?? 0).getTime()
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
