
const regex = /^(?<source>.+?) \| (?<extension>.+?) \| (?:(?<aspectRatio>\d+:\d+) \| )?(?:(?<videoCodec>(?:h265|h264|XviD|DivX|MPEG-1\/2|VP9|RAW)(?: [a-zA-Z0-9\-./]+)?) \| )?(?:(?<dimensions>\d+[xX]\d+)(?: \| )?)?(?:(?<resolution>\d+[pi])(?: \| )?)?(?<audioCodec>[^\|]+?)(?: \| (?<dualAudio>Dual Audio))?(?: \| (?<subtitleType>(?:Softsubs|Hardsubs|RAW))(?: \((?<subgroup>.+?)\))?)?(?: \| Episode (?<episodeNo>\d+))?(?: \| (?<freeleechStatus>Freeleech))?$/;


export function extractExtension(property : string) : string {
    const match = property.match(regex);
    
    if (match?.groups) {
        const extension = match.groups.extension.trim();
        return extension;
    }

    return "";
}

export function extractCodecs(property : string) : string {
    const videoCodec = extractVideoCodecs(property);
    const audioCodec = extractAudioCodecs(property);

    return videoCodec? videoCodec + " " + audioCodec : audioCodec;
}

export function extractResolution(property : string) {
    const match = property.match(regex);
    
    if (match?.groups) {
        let resolution = match.groups.resolution?.trim() || null

        if (!resolution) {
            resolution = match.groups.dimensions || null;
        }

        return resolution?.toLowerCase();
    }

    return "";
}

export function extractSubtitle(property : string) { 
    const match = property.match(regex);
    
    if (match?.groups) {
        const subtitle = match.groups.subtitleType?.trim() || null
        return subtitle;
    }

    return "";
}

export function extractGroup(property : string) : string { 
    const match = property.match(regex);
    const blankLine = "　"; // Make table properly padded
    
    if (match?.groups) {
        const subgroup =  match.groups.subgroup?.trim() || blankLine;
        return subgroup;
    }

    return blankLine;
}

export function extractSource(property : string) : string {
    const match = property.match(regex);
    
    if (match?.groups) {
        const source =  match.groups.source.trim();
        return source;
    }

    return "";
}

export function extractOngoingStatus(property : string) : boolean {
    const episodeMatch =  extractEpisodeNo(property);
    
    if (episodeMatch)
        return true

    return false;
}

export function formatBytes(bytes : number) {
    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
}

function extractVideoCodecs(property : string) {
    const match = property.match(regex);
    
    if (match?.groups) {
        const videoCodec =  match.groups.videoCodec?.trim() || "";
        return videoCodec;
    }

    return "";
}

function extractAudioCodecs(property : string) {
    const match = property.match(regex);
    
    if (match?.groups) {
        const audioCodec =  match.groups.audioCodec.trim() || "";
        return audioCodec;
    }

    return "";
}

export function extractEpisodeNo(property: string) {
    const match = property.match(regex);
    
    if (match?.groups) {
        const episodeNo =  match.groups.episodeNo ? parseInt(match.groups.episodeNo, 10) : null;
        return episodeNo;
    }

    return null;
}

export function extractFreeleechStatus(property: string): boolean {
    const match = property.match(regex);
    
    if (match?.groups) {
        const isFreeleech =  Boolean(match.groups.freeleechStatus);
        return isFreeleech;
    }

    return false;
}

export function generateABTorrentLink(id : number) : string {
    return "https://animebytes.tv/torrents.php?id=" + id.toString();
}

