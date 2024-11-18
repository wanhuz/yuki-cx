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
            />
        ));
        setListCards(listCards);

    }, [contentCard])


    return (
        <div className="container px-5 sm:px-0 sm:mx-auto flex flex-wrap gap-3 flex-1">
            {listCards ? listCards : null}
        </div>
    );
  }