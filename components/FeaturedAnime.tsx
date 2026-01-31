"use client";

import { useEffect, useState } from "react";
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
      className="bi bi-chevron-right"
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
      className="bi bi-chevron-left"
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
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      changeSlide((index + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [index, images.length, interval]);

  if (images.length === 0) return null;

  const current = images[index];

  const handlePrev = () => {
    changeSlide((index - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    changeSlide((index + 1) % images.length);
  };

  return (
    <div className="relative  h-[70vh] w-full overflow-hidden">
      {/* Banner */}
      <Link href={current ? current.series_url : "#"}>
      { current &&
        <Image
          src={current.banner_url}
          fill
          priority
          className="object-cover object-top"
          alt="Featured anime banner"
        />
        }

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
