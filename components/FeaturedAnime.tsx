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

export default function FeaturedAnime({ images, interval = 5000 }: FeaturedAnimeProps) {
  const [index, setIndex] = useState(0);

  // Automatic rotation
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  const current = images[index];

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative  h-[70vh] w-full overflow-hidden">
      {/* Banner */}
      <Link href={current.series_url}>
        <Image
          key={current.banner_url}
          src={current.banner_url}
          fill
          priority
          className="object-cover object-half-bottom transition-opacity duration-700 -z-50"
          alt="Featured anime banner"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Logo */}
        {current.logo_url && (
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
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition"
          >
            →
          </button>
        </>
      )}
    </div>
  );
}
