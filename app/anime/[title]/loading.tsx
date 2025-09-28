import SeriesBackground from "@/components/SeriesBackground";
import SeriesPoster from "@/components/SeriesPoster";

export default function Loading() {
    
    return (
        <>
          {/* Background image */}
          <SeriesBackground imgUrl={"/placeholder.png"}></SeriesBackground>
  
          <main className="container flex flex-col w-80 sm:w-full mx-auto sm:items-start sm:mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-18 mt-28 ">
  
              <div className="mt-5 sm:px-2 md:px-4">
                {<SeriesPoster posterURL={"/placeholder.png"} />}
              </div>
  
              <div className="flex flex-col justify-between  space-y-5 sm:mt-24">
                <div className="">
                  <h1 className="text-xl font-extrabold leading-none text-gray-700 sm:text-white md:text-5xl lg:text-5xl dark:text-white drop-shadow-md flex flex-col gap-1">
                    <div className="h-12 sm:h-0 bg-gray-300  w-full animate-pulse"></div>
                  </h1>
                </div>
  
                <div className="flex flex-row space-x-3 font-bold ">
                  <button disabled className="bg-gray-300 animate-pulse text-gray-300 py-1 px-3  h-12 rounded-xl "> Add to Download </button>
                  <button disabled className="bg-gray-300 animate-pulse text-gray-300 py-1 px-3  h-12 rounded-xl"> Add to Scheduler </button>
                </div>
              </div>
            </div>
  
  
            <div className="flex flex-col sm:w-full lg:flex-row lg:gap-4 sm:gap-2">
              <div className="mt-8 sm:min-w-[230px]">
                <div className="sm:max-w-64 overflow-hidden" >
                  <div id="title">
                      <b>Alternative Title</b>
                      <hr></hr>
                      <ul className="mt-3 text-sm  text-wrap flex flex-col gap-1">
                          <div className="h-4 bg-gray-300  w-1/2 animate-pulse"></div>
                          <div className="h-4 bg-gray-300  w-full animate-pulse"></div>
                          <div className="h-4 bg-gray-300  w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-gray-300  w-1/2 animate-pulse"></div>
                      </ul>
                  </div>
                  <div id="information" className="my-4">
                      <b>Information</b>
                      <hr></hr>
                      <ul className="text-sm flex flex-col gap-2 mt-3 text-wrap">
                          <div className="h-4 bg-gray-300  w-full animate-pulse"></div>
                          <div className="h-4 bg-gray-300  w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-gray-300  w-1/2 animate-pulse"></div>
                          <div className="h-4 bg-gray-300  w-full animate-pulse"></div>
                          <div className="h-4 bg-gray-300  w-1/2 animate-pulse"></div>
                          <div className="h-4 bg-gray-300  w-3/4 animate-pulse"></div>
                      </ul>
                  </div>
                  <div id="information" className="my-4">
                      <b>Resources</b>
                      <hr></hr>
                      <ul className="text-sm flex flex-col gap-1 mt-3 text-wrap">
                          <div className="h-4 bg-gray-300  w-full animate-pulse"></div>
                          <div className="h-4 bg-gray-300  w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-gray-300  w-1/2 animate-pulse"></div>
                          <div className="h-4 bg-gray-300  w-1/2 animate-pulse"></div>
                      </ul>
                  </div>
                </div>
              </div>
  
              <div className="flex flex-col w-full ms-0 lg:ms-8">
                <div className="flex flex-col mt-8">
                  <b>Synopsis</b>
                  <hr></hr>
                  <span className="mt-3 text-sm flex flex-col gap-2">
                    <div className="h-4 bg-gray-300  w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-300  w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-300  w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-300  w-3/4 animate-pulse"></div>
                  </span>
                </div>
  
                <div className="flex flex-col mt-10">
                  <b>Downloads</b>
                  <hr className="mb-3"></hr>
                  <div className="flex flex-col gap-1">
                    <div className="h-8 bg-gray-300 w-full animate-pulse"></div>
                    <div className="h-10 bg-gray-300 w-full animate-pulse"></div>
                    <div className="h-10 bg-gray-300 w-full animate-pulse"></div>
                    <div className="h-10 bg-gray-300 w-full animate-pulse"></div>
                    </div>
                </div>
              </div>
            </div>
          </main>
        </>
    );
}
