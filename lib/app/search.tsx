import { search } from "../api/animebytes";
import { getABSettings } from "../api/settings";
import { Anime } from "../interface/anime";
import { ABAuth, ABGroup } from "../interface/animebytes";
import { extractOngoingStatus } from "../util/animebytes";

export async function searchAnimePage(title: string): Promise<Anime[] | null> {
    const ab_settings = await getABSettings();

    const ab_auth = {
        username: ab_settings.ab_username,
        passkey: ab_settings.ab_key
    } as ABAuth;

    const searchResult = search(ab_auth,title, "DEFAULT");

    const anime_search_result: Anime[] = [];
    
    await searchResult.then((result) => {
        if (result) {
            result.map((entry: ABGroup) => {

                if (entry.SeriesName.toLowerCase().includes(title.toLowerCase())) {
                    anime_search_result.push({
                        ID: entry.ID, 
                        SeriesName: entry.SeriesName, 
                        FullName: entry.FullName,
                        Description: entry.Description, 
                        Image: entry.Image,
                        Type: entry.GroupName,
                        Aired: entry.Year,
                        Ongoing: extractOngoingStatus(entry.Torrents[0].Property ?? "")
                    } as Anime);
                }
            });
        }
    });
    

    return anime_search_result;
}