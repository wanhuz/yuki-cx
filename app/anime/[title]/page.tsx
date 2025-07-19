import { AddToSchedulerForm } from "@/components/AddToSchedulerForm";
import SeriesBackground from "@/components/SeriesBackground";
import SeriesDescription from "@/components/SeriesDescription";
import SeriesMetadata from "@/components/SeriesMetadata";
import SeriesPoster from "@/components/SeriesPoster";
import TorrentTable from "@/components/TorrentTable";
import { getAnime } from "@/lib/api/animebytes";
import { addToScheduler } from "@/lib/api/scheduler";
import { extractOngoingStatus} from "@/lib/util/animebytes";
import {extractTorrent} from "@/lib/util/torrent";
import {removeUnderscoreFromTitle, normalizeDictToArray} from "@/lib/util/util";

export default async function Page({
    params, 
    searchParams
  } : { 
    params: Promise<{ title: string }>, 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  } ) {

  const title = (await params).title;
  const filters = await searchParams;
  const id = Number(filters.id);

  const searchResult = getAnime(removeUnderscoreFromTitle(title), id);
  let anime_data!: Anime;

  await searchResult.then((result) => { 
    anime_data = {
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
      Torrents: extractTorrent(result.Torrents)
    } as Anime;
  });

  return (

      <>
        <SeriesBackground imgUrl={anime_data?.Image || ""}/>

        <main className="container flex flex-col w-80 sm:w-full mx-auto sm:items-start sm:mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-18 mt-28 ">

            <div className="mt-5 sm:px-2 md:px-4">
              <SeriesPoster posterURL={anime_data?.Image || ""} />
            </div>

            <div className="flex flex-col justify-between space-y-5 sm:mt-24 ">
              <div>
                <h1 className="text-xl font-extrabold leading-none text-gray-700 sm:text-white sm:text-5xl lg:text-5xl dark:text-white drop-shadow-md">
                  {anime_data?.SeriesName}
                </h1>
              </div>

              <div className="flex flex-row space-x-3 font-bold ">
                <button disabled className="bg-sky-500 text-white py-1 px-3 hover:bg-sky-600 h-12 rounded-xl text-sm sm:text-md disabled:bg-sky-300"> Add to Download </button>
                {
                  anime_data?.Ongoing ? 
                  <AddToSchedulerForm anime_data={anime_data} />:
                  null
                }
              </div>
            </div>
          </div>


          <div className="flex flex-col sm:w-full lg:flex-row  lg:gap-4 sm:gap-2">
            <div className="mt-8 sm:min-w-full lg:min-w-[230px]">
              {<SeriesMetadata series={anime_data}/>}
            </div>

            <div className="flex flex-col w-full ">
                {<SeriesDescription description={anime_data? anime_data.Description : ""}/>}
                {<TorrentTable torrent_data={anime_data? anime_data.Torrents : []} isOngoing={anime_data? anime_data.Ongoing : false}/>}
            </div>
          </div>
        </main>
      </>
  );
}