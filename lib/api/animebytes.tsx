"use server";
const ANIMEBYTES_URL = "https://animebytes.tv/scrape.php"
const PASSKEY = "";
const USERNAME = "";


export async function search(series_name : string, type : string) {

    const search_query = generateSearchQuery(series_name, type);

    const data = await fetch(search_query);

    const search_result = await data.json();
    const search_result_groups = search_result["Groups"];
    
    return search_result_groups;
}

export async function getAnime(anime_title: string) {
    const search_query = generateSearchQuery(anime_title, "");
    
    const data = await fetch(search_query);

    const search_result = await data.json();
    
    const search_result_groups = await search_result["Groups"];
    

    const anime_data = search_result_groups[0];

    return anime_data;
}

function generateSearchQuery(title : string, type : string) {
    const auth_params = ANIMEBYTES_URL + "?torrent_pass=" + PASSKEY + "&username=" + USERNAME;
    let filter_anime_type_params;

    switch(type) {
        default:
            filter_anime_type_params = "&anime[tv_series]=1"  + "&anime[tv_special]=1" + "&anime[movie]=1" + "&anime[ova]=1" + "&anime[ona]=1"
            break;
        case "TV_SERIES":
            filter_anime_type_params = "&anime[tv_series]=1"
            break;
        case "TV_SPECIAL":
            filter_anime_type_params = "&anime[tv_special]=1"
            break;
        case "OVA":
            filter_anime_type_params = "&anime[ova]=1"
            break;
        case "ONA":
            filter_anime_type_params = "&anime[ona]=1"
            break;
        case "MOVIE":
            filter_anime_type_params = "&anime[movie]=1"
            break;
    }

    const search_query = auth_params + "&searchstr=" + title + "&type=anime" + "&search_type=title" + "&sort=relevance" + filter_anime_type_params

    return search_query
}