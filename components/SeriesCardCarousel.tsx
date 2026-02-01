"use client";

import { useEffect, useRef, useState } from "react";
import SeriesCardSimple from "./SeriesCardSimple";
import useCardsPerPage from "@/hook/cardsPerPage";

export default function SeriesCardGrid({ contentCards }: { contentCards: Anime[] }) {
  const cardsPerPage = useCardsPerPage();
  const [page, setPage] = useState(1); // current page index (1-based)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const deltaRef = useRef(0);
  const [translateX, setTranslateX] = useState(0); // dynamic during drag


  // Split cards into pages
  const pages = [];
  for (let i = 0; i < contentCards.length; i += cardsPerPage) {
    pages.push(contentCards.slice(i, i + cardsPerPage));
  }
  const totalPages = pages.length;

  // Wrap-around: clone last page at start, first page at end
  const displayPages = [pages[totalPages - 1], ...pages, pages[0]];

  // Handle next / prev
  function handleNext() {
    setPage((prev) => prev + 1);
    setIsTransitioning(true);
  }

  function handlePrev() {
    setPage((prev) => prev - 1);
    setIsTransitioning(true);
  }

  // After transition ends, handle wrap-around jump
  function handleTransitionEnd() {
    if (page === 0) {
      setIsTransitioning(false);
      setPage(totalPages);

    } else if (page === totalPages + 1) {
      setIsTransitioning(false);
      setPage(1);

    }
  }


  function handlePointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);

    setIsDragging(true);

    setStartX(e.clientX);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
  
    deltaRef.current = e.clientX - startX;
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!isDragging) return;

    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);

    console.log(deltaRef.current);

    if (deltaRef.current >= 8) {
      handlePrev(); // swipe right → prev
    } else if (deltaRef.current <= -8) {
      handleNext(); // swipe left → next
    } else {
      setTranslateX(-page * 100);
    }

    deltaRef.current = 0;
  }

  useEffect(() => {
      setTranslateX(-page * 100);
  }, [page]);


  return (
    <div className="flex items-center">
      <button onClick={handlePrev} className="p-2 mb-12 hidden lg:block">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
            <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
          </svg>
      </button>

      <div className="overflow-hidden w-full">
          <div
            ref={containerRef}
            className={`flex ${isTransitioning && !isDragging ? "transition-transform duration-500 ease-in-out" : ""}`}
            style={{ transform: `translateX(${translateX}%)` }}
            onTransitionEnd={handleTransitionEnd}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp} // handle drag leaving container
          >
          {displayPages.map((pageCards, i) => (
            <div
              key={i}
              className="min-w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10  md:gap-4 sm:px-6 md:px-0"
            >
              {pageCards.map((entry) => (
                <SeriesCardSimple
                  key={entry.ID}
                  title={entry.SeriesName}
                  poster={entry.Image}
                  id={entry.ID}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleNext} className="p-2 mb-12 hidden lg:block">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg>
      </button>
    </div>
  );
}