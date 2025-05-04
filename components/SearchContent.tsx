import { useEffect, useState } from "react";
import SeriesCard from "./SeriesCard";

interface ContentProps {
    contentCard: Anime[];
 }
  

export default function Content( contentCard : ContentProps) {
    const [listCards, setListCards] = useState<JSX.Element[]>([]);
    
    useEffect(() => {
        const content = contentCard.contentCard;
        
        const listCards = content.map(entry => (
            <SeriesCard 
                key={entry.ID}
                title={entry.SeriesName} 
                poster={entry.Image} 
                id={entry.ID}
                type={entry.Type}
                year={entry.Aired}
                isOngoing={entry.Ongoing}
                summary={entry.Description}
            />
        ));
        setListCards(listCards);

    }, [contentCard])


    return (
        <div className="container px-5 sm:px-0 sm:mx-auto flex flex-wrap flex-1">
          {listCards.length > 0 ? (
            listCards
          ) : 
          (
            // Skeleton Loader
            <div className="flex flex-wrap gap-3">
              {[...Array(15)].map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="w-32 h-48 bg-gray-300 animate-pulse rounded-md"></div>
                  <div className="mt-2 h-3 bg-gray-300 w-32 animate-pulse"></div>
                  <div className="h-3 mb-4 bg-gray-300 w-20 animate-pulse"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
  }
  
