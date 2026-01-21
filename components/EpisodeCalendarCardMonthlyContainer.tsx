"use client";

export default function EpisodeCalendarCardMonthlyContainer({
    cards,
    airdate
}: {
    cards: JSX.Element[];
    airdate: Date;
}) {

    const month = airdate.toLocaleString('en-GB', { month: 'long' });
    const year = airdate.getFullYear();

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-3 mt-2 mb-5">
                <span className="text-2xl text-gray-800 whitespace-nowrap">
                    {month} {year}
                </span>
                <div className="h-px flex-1 bg-gray-300" />
            </div>
            
            <div className="flex flex-row gap-8 flex-wrap">
                {cards.map(card => card)}
            </div>
        </div>
    );
  }