"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type FeaturedAnimeProps = {
  images: FeaturedAnimeImage[];
  interval?: number; 
};

type FeaturedAnimeImage = {
  series_url: string;
  banner_url: string;
  logo_url: string;
};

export default function FeaturedAnime({ images, interval = 7000 }: FeaturedAnimeProps) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const deltaRef = useRef(0);
  const startX = useRef<number | null>(null);
  const [loaded, setLoaded] = useState<boolean[]>(
    () => images.map(() => false)
  );

  function getNextLoadedIndex(
    start: number,
    direction: 1 | -1,
    loaded: boolean[]
  ) {
    const len = loaded.length;

    for (let step = 1; step <= len; step++) {
      const i = (start + direction * step + len) % len;
      if (loaded[i]) return i;
    }

    return start; // fallback (shouldn't happen if at least one is loaded)
  }

  const ChevronRight = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="white"
        stroke="gray"
        strokeWidth="0.1"
        filter="drop-shadow(0px 0px 2px darkgray)"
        className="bi bi-chevron-right hidden md:block"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
        />
      </svg>
    );
  };

  const ChevronLeft = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="white"
        stroke="gray"
        strokeWidth="0.1"
        filter="drop-shadow(0px 0px 2px darkgray)"
        className="bi bi-chevron-left hidden md:block"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
        />
      </svg>
    );
  };


  const changeSlide = (nextIndex: number) => {
    setFade(false); // fade out

    setTimeout(() => {
      setIndex(nextIndex);
      setFade(true); // fade in
    }, 300); // must be <= duration-700
  };


  useEffect(() => {
    if (!loaded.some(Boolean)) return;

    const timer = setInterval(() => {
      const next = getNextLoadedIndex(index, 1, loaded);
      if (next !== index) changeSlide(next);
    }, interval);

    return () => clearInterval(timer);
  }, [index, loaded, interval]);



  if (images.length === 0) return null;

  const current = images[index];

  const handleNext = () => {
    const next = getNextLoadedIndex(index, 1, loaded);
    if (next !== index) changeSlide(next);
  };

  const handlePrev = () => {
    const prev = getNextLoadedIndex(index, -1, loaded);
    if (prev !== index) changeSlide(prev);
  };


  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (startX.current == null) return;

    deltaRef.current = e.clientX - startX.current;
  }

  function onPointerUp() {
    if (startX.current == null) return;

    if (deltaRef.current >= 8) handlePrev(); // 8 is arbitrary after testing
    if (deltaRef.current <= -8) handleNext();

    deltaRef.current = 0;
    startX.current = null;
  }


  return (
    <div className="relative  h-[70vh] w-full overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Banner */}
      <Link href={current ? current.series_url : "#"}>
      {images.map((img, i) => (
        <Image
          unoptimized
          key={i}
          src={img.banner_url}
          fill
          priority={i === 0}
          alt="Featured anime banner"
          className={`
            absolute inset-0 object-cover object-top
            transition-opacity duration-700
            ${i === index && loaded[i] ? "opacity-100" : "opacity-0"}
          `}
          onLoad={() => {
            setLoaded(prev => {
              if (prev[i]) return prev;
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }}
        />
      ))}


        {/* Overlay */}
        <div
          className={`
            absolute inset-0 bg-black
            transition-opacity duration-700
            ${fade ? "opacity-0" : "opacity-100"}
          `}
        />

        {/* Logo */}
        {current && current.logo_url && (
          <div className="absolute right-12 bottom-24 h-20 w-auto">
            <Image
              src={current.logo_url}
              alt="Anime logo"
              height={200}
              width={400}
              className="object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </Link>

      {/* Navigation Arrows */}
      {images && images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-white/30 transition p-2"
          >
            {<ChevronLeft/>}
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-white/30 transition p-2"
          >
            {<ChevronRight/>}
          </button>
        </>
      )}
    </div>
  );
}
