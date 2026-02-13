type AnimeSeason = "Winter" | "Spring" | "Summer" | "Fall";


export function getAnimeSeason(date: Date): AnimeSeason {
  const month = date.getUTCMonth() + 1; // 1–12

  if (month >= 1 && month <= 3) return "Winter";
  if (month >= 4 && month <= 6) return "Spring";
  if (month >= 7 && month <= 9) return "Summer";
  return "Fall";
}

export function getSeasonYear(date: Date) {
  return {
    season: getAnimeSeason(date),
    year: date.getUTCFullYear()
  };
}
