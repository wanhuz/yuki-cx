import EpisodeCalendarCard from "../../components/EpisodeCalendarCard";
import EpisodeCalendarCardContainer from "../../components/EpisodeCalendarCardContainer";
import EpisodeCalendarCardMonthlyContainer from "../../components/EpisodeCalendarCardMonthlyContainer";

export function buildDailyContainers(
  episodes: { 
    entry: { 
      ab_id: number; 
      series_name: string
    }; 
    ref: { 
      series_name: string; 
      studio_name: string; 
      summary: string; 
      tags: string; 
      poster_url: string; 
      airing_time: Date
    }; 
    episode: { 
      episode_number: number; 
      episode_title: string; 
      episode_date: Date;
    } 
  }[]): JSX.Element[] {

  const containers: JSX.Element[] = [];

  let currentDateKey = "";
  let currentCards: JSX.Element[] = [];
  let currentAirdate: Date | null = null;

  for (const { entry, ref, episode } of episodes) {
    const airdate = episode.episode_date ?? new Date();
    const dateKey = airdate.toISOString().split("T")[0];

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
        airtime={ref.airing_time}
      />
    );
  }

  if (currentCards.length && currentAirdate) {
    containers.push(
      <EpisodeCalendarCardContainer
        key={currentDateKey}
        airdate={currentAirdate}
        cards={currentCards}
      />
    );
  }

  return containers;
}

export function buildMonthlyContainers(
  dailyContainers: JSX.Element[]
): JSX.Element[] {
  const monthly: JSX.Element[] = [];

  let currentMonthKey = "";
  let currentMonthContainers: JSX.Element[] = [];
  let currentMonthDate: Date | null = null;

  for (const container of dailyContainers) {
    const airdate: Date = container.props.airdate;
    const monthKey = airdate.toISOString().slice(0, 7);

    if (monthKey !== currentMonthKey && currentMonthContainers.length) {
      monthly.push(
        <EpisodeCalendarCardMonthlyContainer
          key={currentMonthKey}
          airdate={currentMonthDate!}
          cards={currentMonthContainers}
        />
      );
      currentMonthContainers = [];
    }

    currentMonthKey = monthKey;
    currentMonthDate = airdate;
    currentMonthContainers.push(container);
  }

  if (currentMonthContainers.length && currentMonthDate) {
    monthly.push(
      <EpisodeCalendarCardMonthlyContainer
        key={currentMonthKey}
        airdate={currentMonthDate}
        cards={currentMonthContainers}
      />
    );
  }

  return monthly;
}
