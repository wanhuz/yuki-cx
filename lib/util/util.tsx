import { decode } from "entities";

export function removeUnderscoreFromTitle(title : string) {
    return title.replaceAll("_", " ");
}

export function normalizeDictToArray(dict: object) {
    if (!Array.isArray(dict)) {
        return Object.values(dict);
    } else if (Array.isArray(dict)) {
        return dict;
    } else {
        return [];
    }
}

export function stripHTML(html: string): string {
  const noTags = html.replace(/<[^>]*>/g, "");
  return decode(noTags);
}

export function extractAniDBIDFromLinks(links: string[]): number | null {
    for (const link of links) {
        if (!link.startsWith("https://anidb.net/anime/")) continue;

        const match = link.match(/anidb\.net\/anime\/(\d+)/);

        if (match) {
            return Number(match[1]);
        }
    }

    return null;
}