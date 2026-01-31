import { useEffect, useState } from "react";

export default function useCardsPerPage() {
  const [cardsPerPage, setCardsPerPage] = useState(4);

  useEffect(() => {
    function update() {
      const width = window.innerWidth;

      if (width >= 1024) setCardsPerPage(10);      // lg
      else if (width >= 768) setCardsPerPage(4);   // md
      else setCardsPerPage(3);                     // sm
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cardsPerPage;
}
