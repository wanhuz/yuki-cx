import { search } from "@/lib/app/animebytes";
import { getABSettings } from "../api/settings";
import { Anime } from "../interface/anime";
import { ABAuth, ABGroup, ABSearchQueryParams } from "../interface/animebytes";
import { extractOngoingStatus } from "../util/animebytes";
import { SearchFiltersState } from "../interface/search-filter";

export async function searchAnimePage(title: string, filters: SearchFiltersState): Promise<Anime[] | null> {
    const ab_settings = await getABSettings();

    const ab_auth = {
        username: ab_settings.ab_username,
        passkey: ab_settings.ab_key
    } as ABAuth;

    const ab_search_params = generateABParams(title, filters);

    const searchResult = search(ab_auth, ab_search_params);

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

function generateABParams(title: string, filters: SearchFiltersState) : ABSearchQueryParams {

    const ab_search_params = {
        title: title,
        maxItem: Number(filters.count)
    } as ABSearchQueryParams;

    switch(filters.status) {
        case "Ongoing":
            ab_search_params.airing = 1;
            break;
        case "Finished":
            ab_search_params.airing = 0;
            break;
        default:
            ab_search_params.airing = -1;
            break;
    }

    switch (filters.type) {
        case "TV Series":
            ab_search_params.type = "TV_SERIES";
            break;
        case "Movie":
            ab_search_params.type = "MOVIE";
            break;
        case "Special":
            ab_search_params.type = "SPECIAL";
            break;
        default:
            ab_search_params.type = "DEFAULT";
            break;
    }

    switch (filters.sort) {
        case "Name":
            ab_search_params.sort = "name";
            break;
        case "Year":
            ab_search_params.sort = "year";
            break;
        case "Rating":
            ab_search_params.sort = "rating";
            break;
        case "Votes":
            ab_search_params.sort = "votes";
            break;
        default:
            ab_search_params.sort = "relevance";
            break;
    }

    switch (filters.direction) {
        case "Ascending":
            ab_search_params.way = "asc";
            break;
        case "Descending":
            ab_search_params.way = "desc";
            break;
        default:
            ab_search_params.way = "desc";
            break;
    }

    return ab_search_params;
}