"use client";

export default function EpisodeCalendarCardContainer({
    cards,
    airdate
}: {
    cards: JSX.Element[];
    airdate: Date;
}) {

    const day = airdate.getDate();
    const today = new Date();

    const isToday = day === today.getDate();
    const isTomorrow = day === today.getDate() + 1;

    const weekday = airdate.toLocaleString('en-GB', { weekday: 'long' });
    const month = airdate.toLocaleString('en-GB', { month: 'long' });

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="text-sm font-medium text-gray-800 mb-2">
                {isToday ? "Today" : isTomorrow ? "Tomorrow" : `${weekday}, ${day} ${month} `}
            </div>
            
            <div className="flex flex-row gap-6 flex-wrap">
                {cards.map(card => card)}
            </div>
        </div>
    );
  }