import { useEffect, useState } from "react";
import SeriesCard from "./SeriesCard";

interface ContentProps {
    contentCard: Anime[];
  }
  

export default function Content( contentCard : ContentProps) {
    const [listCards, setListCards] = useState<SeriesCard[]>([]);
    

    useEffect(() => {
        const content = contentCard.contentCard;
        
        const listCards = content.map(entry => (
            <SeriesCard 
                key={entry.ID}
                title={entry.SeriesName} 
                poster={entry.Image} 
            />
        ));
        setListCards(listCards);

    }, [contentCard])


    return (
        <div className="container mx-auto flex flex-wrap gap-3">
            {listCards ? listCards : null}
        </div>
    );
  }