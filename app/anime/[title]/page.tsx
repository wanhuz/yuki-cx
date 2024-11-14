import SeriesMetadata from "@/components/SeriesMetadata";
import SeriesPoster from "@/components/SeriesPoster";
import { getAnime } from "@/lib/api/animebytes";
import {removeUnderscoreFromTitle, normalizeDictToArray} from "@/lib/util/util";
import Image from "next/image";
export default async function Page({params} : { params: { title: string }} ) {
  const searchResult = getAnime(removeUnderscoreFromTitle(params.title));
  let anime_data : Anime;

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
      Links: normalizeDictToArray(result.Links)
    } as Anime;
  });

  return (

      <>
        {/* Background image */}
        <div className="-z-50 h-96 w-full absolute">
          <div>
              <Image fill={true} className="object-cover object-half-top" src={anime_data? anime_data.Image : ""}  alt=""></Image>
              <div  className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          </div>
        </div>

        <main className="container flex flex-col w-80 sm:w-full mx-auto sm:items-start sm:mx-auto mb-10">

          {/* Main information */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-24 mt-28 ">

            <div className="mt-5">
              {<SeriesPoster posterURL={anime_data? anime_data.Image : ""}>
              </SeriesPoster> }
            </div>

            <div className="flex flex-col justify-between  space-y-5 sm:mt-24">

              <div className="">
                <h1 className="text-xl font-extrabold leading-none text-gray-700 sm:text-white md:text-5xl lg:text-5xl dark:text-white drop-shadow-md">
                  {anime_data?.SeriesName}
                </h1>
              </div>

              <div className="flex flex-row space-x-3  ">
                <button className="bg-sky-500 text-white py-1 px-3 rounded hover:bg-sky-600 h-12 rounded-xl "> Add to Download </button>
                <button className="bg-sky-500 text-white py-1 px-3 rounded hover:bg-sky-600 h-12 rounded-xl"> Add to Scheduler </button>
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

              <div className="flex flex-col mt-10  ">
                <b>Downloads</b>
                <hr />
                <table className="mt-5">
                  <thead className="bg-sky-500 text-white text-xs sm:text-base">
                    <tr>
                      <th className="table-cell sm:hidden">Name</th>
                      <th className="py-2 hidden sm:table-cell">Group</th>
                      <th className="hidden sm:table-cell">Resolution</th>
                      <th className="hidden sm:table-cell">Type</th>
                      <th className="hidden sm:table-cell">Extension</th>
                      <th className="hidden sm:table-cell">Subtitle</th>
                      <th className="hidden sm:table-cell">Size</th>
                      <th className="hidden sm:table-cell">Codec</th>
                      <th className="sm:hidden">Health</th>
                      <th className="hidden sm:table-cell">Seeders</th>
                      <th className="hidden sm:table-cell">Leechers</th>
                      <th className="sm:hidden">Action</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </main>
      </>
  );
}