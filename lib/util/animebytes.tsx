

export function extractTorrent(torrentResult) : Torrent[] {
    const torrent_extracted: Torrent[] = [];

    torrentResult.map((entry: { ID: number; Property: string; Seeders: number; Leechers: number; Size: number; Link: string}) => {
        torrent_extracted.push({
            ID: entry.ID, 
            Group: extractGroup(entry.Property), 
            Resolution: extractResolution(entry.Property), 
            Codec: extractCodecs(entry.Property),
            Extension: extractExtension(entry.Property),
            Subtitle: extractSubtitle(entry.Property),
            Seeders: entry.Seeders,
            Leechers: entry.Leechers,
            Size: formatBytes(entry.Size),
            Link: entry.Link,
            Property: entry.Property
        } as Torrent);
    });

    return torrent_extracted;
}

function extractExtension(property : string) : string {
    const properties = property.split("|");

    return properties[1].trim();
}

function extractCodecs(property : string) : string {
    const properties = property.split("|");

    return properties[2].trim() + " " + properties[4].trim();
}

function extractResolution(property : string) : string {
    const properties = property.split("|");

    return properties[3].trim();
}

function extractSubtitle(property : string) : string {
    const properties = property.split("|");

    return properties[5].split(" (")[0].trim();
}

function extractGroup(property : string) : string {
    const properties = property.split("|");

    let group = getTextInBrackets(properties[5].trim());

    if (group === "　")
        group = getTextInBrackets(properties[6].trim());

    return group;
}

function formatBytes(bytes : number) {
    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
}

function getTextInBrackets(str : string) {
    const match = str.match(/\(([^)]+)\)/);
    return match ? match[1] : "　";
}