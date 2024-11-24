// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Anime {
    ID: number;
    SeriesName: string;
    FullName: string;
    Description: string;
    Image: string;
    AlternativeName: string[];
    StudioList: string,
    Type: string;
    Episode: number;
    Aired: string;
    Tags: string[];
    Links: string[];
    Ongoing: boolean;
    RelatedAnime?: string[];
    Torrents: Torrent[]
}