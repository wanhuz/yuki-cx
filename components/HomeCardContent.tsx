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
    <div className="container px-0 py-3 md:px-5 lg:py-0 sm:mx-auto flex flex-col flex-wrap flex-1 gap-2 md:gap-4 m-0 sm:m-4 md:mt-2">
            <h1 className="px-2 sm:px-8 text-xl">{title}</h1>

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

  
