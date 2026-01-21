"use client";

export default function EpisodeCalendarCardContainer({
    cards,
    airdate
}: {
    cards: JSX.Element[];
    airdate: Date;
}) {

    function isSameDay(a: Date, b: Date) {
        return (
            a.getDate() === b.getDate() &&
            a.getMonth() === b.getMonth() &&
            a.getFullYear() === b.getFullYear()
        );
    }

    const day = airdate.getDate();
    const today = new Date();

    const isToday = isSameDay(airdate, today);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isTomorrow = isSameDay(airdate, tomorrow);

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