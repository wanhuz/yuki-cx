import { generateABTorrentLink } from "@/lib/util/animebytes";


function generateLinkList(links : string[]) : JSX.Element[] {
    const linksElement = links.map((link, index) => (
        <p key={index + 1}>{generateLink(link)}</p>
    ));

    return linksElement;
}

function generateLink(link: string): JSX.Element {
    const domainMap: Record<string, string> = {
        "anidb.net": "AniDB",
        "animenewsnetwork.com": "Anime News Network",
        "wikipedia.org": "Wikipedia",
        "myanimelist.net": "MyAnimeList",
        "animebytes.tv" : "AnimeBytes"
    };

    const baseStyle = "text-sky-600 hover:text-sky-800";

    try {
        const url = new URL(link);
        const domain = Object.keys(domainMap).find(d => url.hostname.includes(d));
        const text = domain ? domainMap[domain] : url.hostname; 
        return (<a href={link} className={baseStyle} target="_blank">{text}</a>);
    } catch (error) {
        console.error(`Invalid URL: ${link}`, error);
        return (<a href={link} className={baseStyle} target="_blank">{link}</a>);
    }
}


function generateTagList(tags : string[]) : JSX.Element[] {
    const tagsElement = tags.map((tag, index) =>  
        index === tags.length - 1 ? 
            <span key={index}>{tag.replace(".", " ")} </span> :
        <span key={index}>{tag.replace(".", " ")}, </span>
    );

    return tagsElement;
}

function generateABLinkList(link : string) : JSX.Element {
    return <p key={0}>{generateLink(link)}</p>
}

function generateAltNameList(alternativeName : string[]) : JSX.Element[] {
    const altName = (alternativeName || []).map((name, index) => (
        <li key={index}>{name}</li>
    ));

    return altName;
}

function generateStudioList(studioList : string) : string {
    const cleanedStudioList = studioList ? studioList.match(/[^|/]+(?=\/\/\/)/g)?.join(", ") : null;

    return cleanedStudioList ? cleanedStudioList : "";
}

export default function SeriesMetadata({series} : {series : Anime}) {

    const altName = generateAltNameList(series.AlternativeName);

    const links = [generateABLinkList(generateABTorrentLink(series.ID))];
    
    generateLinkList(series.Links).map(
        linkElement => links.push(linkElement)
    );
    
    const tags = generateTagList(series.Tags);

    const studios = generateStudioList(series.StudioList);

    return (
        <div className="sm:max-w-64 overflow-hidden flex flex-col sm:flex-row sm:min-w-full sm:px-2 lg:flex-col md:min-w-auto gap-4" >
            <div id="title" className={series.AlternativeName.length ? "block" : "hidden"}>
                <b>Alternative Title</b>
                <hr></hr>
                <ul className="mt-3 text-sm text-wrap">
                    {series.AlternativeName.length ? altName : " "}
                </ul>
            </div>
            <div id="information" >
                <b>Information</b>
                <hr></hr>
                    <ul className="mt-3 text-sm flex flex-col gap-1 text-wrap">
                        <li><b>Type:</b> {series.Type}</li>
                        <li><b>Episodes:</b> {series.Episode > 0 ? series.Episode : "-"}</li>
                        <li><b>Status:</b> {series.Ongoing ? "Currently Airing" : "Finished Airing" }</li>
                        <li><b>Studio:</b> {studios}</li>
                        <li><b>Aired:</b> {series.Aired}</li>
                        <li><b>Tags:</b> {tags? tags : ""}</li>
                    </ul>
            </div>

            <div id="resources" >
                <b>Resources</b>
                <hr></hr>

                <div className="text-sm mt-3 flex flex-col gap-1">
                    {links? links : ""}
                </div>
            </div>
        </div>
    );
  }