import SeriesBackground from "@/components/SeriesBackground";
import SeriesMetadata from "@/components/SeriesMetadata";
import SeriesPoster from "@/components/SeriesPoster";
import { TorrentCard } from "@/components/TorrentCard";
import { getAnime } from "@/lib/api/animebytes";
import { extractTorrent } from "@/lib/util/animebytes";
import {removeUnderscoreFromTitle, normalizeDictToArray} from "@/lib/util/util";

export default async function Page({
  params, 
  searchParams
  } : { 
  params: { title: string }, 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  } ) {

  const title = params.title;
  const filters = await searchParams;
  const id = Number(filters.id);

  const searchResult = getAnime(removeUnderscoreFromTitle(title), id);
  let anime_data!: Anime;
  let series_torrent: JSX.Element[]  | null = null;

  await searchResult.then((result) => { 

    anime_data = {
      ID: result.ID, 
      SeriesName: result.SeriesName, 
      Description: result.Description, 
      Image: result.Image,
      Studio: result.StudioList,
      AlternativeName: normalizeDictToArray(result.Synonymns),
      Type: result.GroupName,
      Episode: result.EpCount,
      Aired: result.Year,
      Tags: result.Tags,
      Links: normalizeDictToArray(result.Links),
      Torrents: extractTorrent(result.Torrents)
    } as Anime;

    series_torrent = anime_data.Torrents.map((entry) => (
      <TorrentCard torrent={entry} key={entry.ID} />
    ));
    
  });

  return (

      <>
        {/* Background image */}
        <SeriesBackground imgUrl={anime_data?.Image || ""}></SeriesBackground>

        <main className="container flex flex-col w-80 sm:w-full mx-auto sm:items-start sm:mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-24 mt-28 ">

            <div className="mt-5">
              <SeriesPoster posterURL={anime_data?.Image || ""}>
              </SeriesPoster>
            </div>

            <div className="flex flex-col justify-between  space-y-5 sm:mt-24">
              <div className="">
                <h1 className="text-xl font-extrabold leading-none text-gray-700 sm:text-white md:text-5xl lg:text-5xl dark:text-white drop-shadow-md">
                  {anime_data?.SeriesName}
                </h1>
              </div>

              <div className="flex flex-row space-x-3 font-bold ">
                <button className="bg-sky-500 text-white py-1 px-3 hover:bg-sky-600 h-12 rounded-xl "> Add to Download </button>
                <button className="bg-sky-500 text-white py-1 px-3 hover:bg-sky-600 h-12 rounded-xl"> Add to Scheduler </button>
              </div>
            </div>
          </div>


          <div className="flex flex-col sm:w-full sm:flex-row sm:gap-24">
            <div className="mt-8 sm:min-w-[230px]">
              {<SeriesMetadata series={anime_data}></SeriesMetadata>}
            </div>

            <div className="flex flex-col w-full ">
              <div className="flex flex-col mt-8">
                <b>Synopsis</b>
                <hr></hr>
                <span className="mt-3 text-sm">
                  {anime_data?.Description}
                </span>
              </div>

              <div className="flex flex-col mt-10">
                <b>Downloads</b>
                <hr />
                <table className="bg-sky-500 py-3 mt-3 text-sm">
                  <thead>
                    <tr className="text-white text-start  font-bold">
                        <td className="py-3 px-5">Name</td>
                        <td className="hidden sm:table-cell">Resolution</td>
                        <td className="hidden sm:table-cell">Codec</td>
                        <td className="hidden sm:table-cell">Extension</td>
                        <td className="hidden sm:table-cell">Size</td>
                        <td className="hidden sm:table-cell">Subtitle</td>
                        <td className="hidden sm:table-cell">Seeders</td>
                        <td className="hidden sm:table-cell">Leechers</td>
                        <td className="table-cell sm:hidden">Health</td>
                        <td>Downloads</td>
                    </tr>
                  </thead>
                  <tbody>
                    {series_torrent}
                  </tbody>
                  
                </table>
              </div>
            </div>
          </div>
        </main>
      </>
  );
}