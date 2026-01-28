"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type FeaturedAnimeProps = {
  images: FeaturedAnimeImage[];
  interval?: number; 
};

type FeaturedAnimeImage = {
  banner_url: string;
  logo_url: string;
};

export default function FeaturedAnime({ images, interval = 5000 }: FeaturedAnimeProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  const current = images[index];

  return (
    <div className="relative -z-50 h-[70vh] w-full overflow-hidden">
      {/* Banner */}
      <Image
        key={current.banner_url}
        src={current.banner_url}
        fill
        priority
        className="object-cover object-half-bottom transition-opacity duration-700"
        alt="Featured anime banner"
      />

      {/* Overlay (optional for readability) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Logo */}
      {current.logo_url && (
        <div className="absolute right-12 bottom-24 h-20 w-auto">
          <Image
            src={current.logo_url}
            alt="Anime logo"
            height={200}
            width={400} // optional: maintain aspect ratio
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}
