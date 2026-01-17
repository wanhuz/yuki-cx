import { useEffect, useState } from "react";
import SeriesCard from "./SeriesCard";
import SeriesCardPlaceholder from "./SeriesCardPlaceholder";


 export default function Content({ contentCard, isSearch }: { contentCard: Anime[], isSearch: boolean }) {
  const [listCards, setListCards] = useState<JSX.Element[]>([]);
  const placeholderCard = Array.from({ length: 25 }, (_, i) => (
    <SeriesCardPlaceholder
      key={i}
    />
  ));

  useEffect(() => {
    const content = contentCard;

    if (content) {
      const cards = content.map(entry => (
        <SeriesCard
          key={entry.ID}
          title={entry.SeriesName}
          poster={entry.Image}
          id={entry.ID}
          type={entry.Type}
          year={entry.Aired}
          isOngoing={entry.Ongoing}
          summary={entry.Description}
        />
      ));
      setListCards(cards);
    } else {
      setListCards([]);
    }

  }, [contentCard]);

  return (
    <div className="container px-5 sm:px-0 sm:mx-auto flex flex-wrap flex-1 md:gap-3">
      {isSearch ? (
        // Show Skeleton
        placeholderCard
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

  
