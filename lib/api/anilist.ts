"use server";


export async function getAnilistID(mal_id: number) {

    let query = `
        query ($idMal: Int) { # Define which variables will be used in the query (id)
            Media (idMal: $idMal, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
                id
            }
        }
        `;

    var variables = {
        idMal: mal_id
    };

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    try {
        const response = await fetch(url, options);

        const data = await response.json();

        return data.data.Media.id;
    } catch (error) {
        console.log(error);
    }

    return -1;
}

export async function getAnimeAiringTime(anilist_id: number): Promise<Date | null> {
    let query = `
        query ($id: Int) {
            Media(id: $id, type: ANIME) {
                nextAiringEpisode {
                    airingAt
                }
            }
        }
    `

    let variables = {
        id: anilist_id
    };

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    try {
        const response = await fetch(url, options);

        const data = await response.json();

        const nextAiringEpisode = data.data?.Media?.nextAiringEpisode ?? null;

        const date = new Date(nextAiringEpisode.airingAt * 1000);

        return date
    } catch (error) {
        console.log(error);
    }

    return null;
}