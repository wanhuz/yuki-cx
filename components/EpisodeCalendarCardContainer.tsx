"use client";

export default function EpisodeCalendarCardContainer({
    cards,
    airdate
}: {
    cards: JSX.Element[];
    airdate: Date;
}) {

    const day = airdate.getDate();
    const weekday = airdate.toLocaleString('en-GB', { weekday: 'long' });
    const month = airdate.toLocaleString('en-GB', { month: 'long' });
    const year = airdate.getFullYear();

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="text-sm font-semibold text-gray-500 mt-6 mb-1">
                {weekday} &mdash; {day} {month} {year}
            </div>
            

            <hr className="border-gray-200 dark:border-gray-700 mb-3"></hr>
            <div className="flex flex-row gap-4">
                {cards.map(card => card)}
            </div>
        </div>
    );
  }