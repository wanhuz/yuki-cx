"use client";

import SeriesCardCarousel from "./SeriesCardCarousel";
import SeriesCardPlaceholder from "./SeriesCardPlaceholder";


 export default function HomeCardContent({title, contentCard }: {title: string; contentCard: Anime[] | null}) {
  const placeholderCard = Array.from({ length: 8 }, (_, i) => (
    <SeriesCardPlaceholder
      key={i}
    />
  ));

  return (
    <div className="container px-5 sm:px-0 sm:mx-auto flex flex-col flex-wrap flex-1 md:gap-4 mt-2">
            <h1 className="text-xl">{title}</h1>
            <div className="flex flex-wrap flex-1 md:gap-3">
              {contentCard === null && placeholderCard}

              {contentCard !== null && contentCard.length === 0 && (
                <div className="text-center text-md text-gray-700">
                  No results found
                </div>
              )}

              {contentCard ? <SeriesCardCarousel contentCards={contentCard}></SeriesCardCarousel> : null}
            </div>
    </div>

  );
}

  
