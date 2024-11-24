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

