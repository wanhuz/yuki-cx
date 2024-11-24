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

export function generateLink(link: string): JSX.Element {
    const domainMap: Record<string, string> = {
        "anidb.net": "AniDB",
        "animenewsnetwork.com": "Anime News Network",
        "wikipedia.org": "Wikipedia",
        "myanimelist.net": "MyAnimeList",
        "animebytes.tv" : "AnimeBytes"
    };

    const baseStyle = "text-blue-600 hover:text-blue-800 ";

    try {
        const url = new URL(link);
        const domain = Object.keys(domainMap).find(d => url.hostname.includes(d));
        const text = domain ? domainMap[domain] : url.hostname; 
        return (<a href={link} className={baseStyle} target="_blank">{text}</a>);
    } catch (error) {
        console.error(`Invalid URL: ${link}`, error);
        return (<a href={link} className={baseStyle} target="_blank">{link}</a>);
    }
}
