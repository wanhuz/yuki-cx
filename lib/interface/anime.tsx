// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Anime {
    ID: number;
    SeriesName: string;
    FullName: string;
    Description: string;
    Image: string;
    AlternativeName: string[];
    Studio: string[],
    Type: string;
    Episode: number;
    Aired: string;
    Tags: string[];
    Links: string[];
    RelatedAnime?: string[];
    Torrents: Torrent[]
}