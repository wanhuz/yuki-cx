import { HeroType } from "../enum/hero";

let rrIndex = 0;

const nonSeasonalTypes: HeroType[] = [
  HeroType.Genre,
  HeroType.Year,
  HeroType.Underrated,
  HeroType.Wildcard
];

export function getNextHeroType(): HeroType {
  const roll = Math.random();

  if (roll < 0.20) {
    return HeroType.Seasonal;
  }

  const type = nonSeasonalTypes[rrIndex];
  rrIndex = (rrIndex + 1) % nonSeasonalTypes.length;

  return type;
}
