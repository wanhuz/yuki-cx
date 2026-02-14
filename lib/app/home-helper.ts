import { HeroType } from "../enum/hero";


export function getNextHeroType(): HeroType {
  // 20% chance for Seasonal
  if (Math.random() < 0.2) return HeroType.Seasonal;

  // Pick randomly from the non-seasonal types
  const nonSeasonalTypes = [
    HeroType.Genre,
    HeroType.Year,
    HeroType.Underrated,
    HeroType.Wildcard
  ];

  const randomIndex = Math.floor(Math.random() * nonSeasonalTypes.length);
  return nonSeasonalTypes[randomIndex];
}