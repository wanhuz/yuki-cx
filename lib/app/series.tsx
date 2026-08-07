import { Anime } from "../interface/anime";
import { removeUnderscoreFromTitle } from "../util/util";
import { extractOngoingStatus} from "@/lib/util/animebytes";
import {extractTorrent} from "@/lib/util/torrent";
import {normalizeDictToArray} from "@/lib/util/util";
import { getAnime } from "../api/animebytes";
import { ABAuth } from "../interface/animebytes";
import { getABSettings } from "../api/settings";

export function generateSeriesLink(title : string, id : number) {
    return "/anime/" + encodeURIComponent(title) + "?id=" + id;
}

export function generateTagLabel(type : string) {
    let style = "inline-block text-xxs text-white rounded-full "

    switch(type) {
        case "DVD Special":
            style += "px-1 ";
        default:
            style += "px-2 ";
    }
    
    switch(type) {
        case "TV Series":
            style += "bg-sky-500";
            break;
        case "Movie":
            style += "bg-green-500";
            break;
        case "TV Special":
            style += "bg-purple-500";
            break;
        case "BD Special":
            style += "bg-green-500";
            break;
        case "DVD Special":
            style += "bg-blue-500";
            break;
        case "ONA":
            style += "bg-red-500";
            break;
        case "OVA":
            style += "bg-orange-500";
            break;
        case "Airing":
            style += "bg-pink-500";
            break;
        default:
            style += "bg-gray-500";
    }

    return (
        <span className={style}>
            {type}
        </span>
    );
}

export async function getAnimePage(ab_title : string, ab_id: number) : Promise<Anime | null> {
    const ab_settings = await getABSettings();

    const ab_auth = {
        username: ab_settings.ab_username,
        passkey: ab_settings.ab_key
    } as ABAuth;

    const title = removeUnderscoreFromTitle(ab_title);

    const result = await getAnime(ab_auth, title, ab_id);

    if (!result) return null;
    
    const anime_data: Anime = {
        ID: result.ID,
        SeriesName: result.SeriesName,
        Description: result.DescriptionHTML,
        Image: result.Image,
        StudioList: result.StudioList,
        AlternativeName: normalizeDictToArray(result.Synonymns),
        Type: result.GroupName,
        Episode: result.EpCount,
        Aired: result.Year,
        Tags: result.Tags,
        Ongoing: extractOngoingStatus(result.Torrents[0].Property),
        Links: normalizeDictToArray(result.Links),
        Torrents: extractTorrent(result.Torrents),
        FullName: ""
    };

    return anime_data;
}