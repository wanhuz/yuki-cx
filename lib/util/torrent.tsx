import {formatBytes, extractSource, extractGroup, extractResolution, extractCodecs, extractExtension, extractSubtitle, extractEpisodeNo, extractFreeleechStatus} from "@/lib/util/animebytes";

export function extractTorrent(torrentResult: { ID: number; Property: string; Seeders: number; Leechers: number; Size: number; Link: string; FileList: [{filename : string, size : number}] }[]) : Torrent[] {
    const torrent_extracted: Torrent[] = [];

    torrentResult.map((entry: { ID: number; Property: string; Seeders: number; Leechers: number; Size: number; Link: string; FileList: [{filename : string, size : number}]}) => {
        torrent_extracted.push({
            ID: entry.ID, 
            Source: extractSource(entry.Property),
            Group: extractGroup(entry.Property), 
            Resolution: extractResolution(entry.Property), 
            Codec: extractCodecs(entry.Property),
            Extension: extractExtension(entry.Property),
            Subtitle: extractSubtitle(entry.Property),
            Seeders: entry.Seeders,
            Leechers: entry.Leechers,
            Size: formatBytes(entry.Size),
            EpisodeNo: extractEpisodeNo(entry.Property),
            FreeleechStatus: extractFreeleechStatus(entry.Property),
            Link: entry.Link,
            Property: entry.Property,
            FileList: entry.FileList.map(item => ({filename : item.filename, size: item.size} as FileData))
        } as Torrent);
    });
    
    return torrent_extracted;
}

export function extractTorrentFilter(torrentResult : Torrent[]) {
    const distinct_quality: string[] = [];
    const distinct_extension: string[] = [];
    const distinct_group: string[] = [];

    torrentResult.map((entry: Torrent) => {
        if (!distinct_group.includes(entry.Group)) {
            distinct_group.push(entry.Group)
        }
        if (!distinct_extension.includes(entry.Extension)) {
            distinct_extension.push(entry.Extension)
        }
        if (!distinct_quality.includes(entry.Resolution)) {
            distinct_quality.push(entry.Resolution)
        }
    });
    
    const filters: Filters = {
        quality: distinct_quality,
        subgroup: distinct_group,
        extension: distinct_extension
    }

    return filters;
}