export default function SeriesCardPlaceholder() {
  return (
    <div className="flex-shrink-0 flex-grow-0 w-full px-2 py-1 md:px-0 md:flex-initial md:w-auto md:py-0">
      <div className="w-full md:w-min-content md:max-w-min md:h-min-content flex flex-row md:flex-col overflow-hidden rounded-md animate-pulse">

        {/* Poster */}
        <div className="w-48 md:w-32 h-48 md:h-50 bg-gray-300 rounded-md" />

        {/* Content */}
        <div className="flex flex-col justify-between w-full px-2 sm:px-0 py-4 md:py-4 md:pt-5 md:min-h-[100px] gap-2">

          {/* Title (2 lines max) */}
          <div className="px-2 space-y-1">
            <div className="h-3 bg-gray-300  w-full" />
            <div className="h-3 bg-gray-300  w-3/4" />
          </div>

          {/* Summary (mobile only, same as real card) */}
          <div className="px-2 space-y-1 md:hidden">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>

          {/* Tags */}
          <div className="md:hidden flex flex-row gap-1 flex-wrap w-32 px-2 md:px-0">
            <div className="h-3 w-10 bg-gray-300 rounded" />
            <div className="h-3 w-10 bg-gray-300 rounded" />
          </div>

        </div>
      </div>
    </div>
  );
}
