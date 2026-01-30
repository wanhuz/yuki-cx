import { useState } from "react";
import SeriesCardSimple from "./SeriesCardSimple";

export default function SeriesCardGrid({ contentCards }: { contentCards: Anime[] }) {
  const [page, setPage] = useState(1);

  // Create the cards
  const cards = contentCards?.map(entry => (
    <SeriesCardSimple
      key={entry.ID}
      title={entry.SeriesName}
      poster={entry.Image}
      id={entry.ID}
      summary={entry.Description}
    />
  ));

  // Slice 10 cards per page
  const cardsPerPage = 10;
  const currentCards = cards.slice((page - 1) * cardsPerPage, page * cardsPerPage);

  const totalPages = Math.ceil(cards.length / cardsPerPage);

  function handlePrev() {
    setPage(page > 1 ? page - 1 : totalPages);
  }

  function handleNext() {
    setPage(page < totalPages ? page + 1 : 1);
  }

  return (
    <div className="flex flex-row justify-between">
      <button
          onClick={handlePrev}
          className="p-2 mb-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
            <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
          </svg>
        </button>
      {/* Grid of 10 cards */}
      <div className="grid grid-cols-10 gap-4">
        {currentCards}
      </div>


        <button
          onClick={handleNext}
          className="p-2  mb-12"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg>
        </button>
      </div>
  );
}
