// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Torrent {
    ID: number,
    Release: string,
    Group: string,
    Resolution: string,
    Codec: string,
    Extension: string,
    Subtitle: string,
    Seeders: number,
    Leechers: number,
    Size: string,
    EpisodeNo: number,
    FreeleechStatus: boolean,
    Link: string,
    Property? : string
}