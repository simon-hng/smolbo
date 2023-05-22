import { type Card } from "@prisma/client";
import { CardCard } from "./cardCard";

interface CardCarouselProps {
  cards: Card[];
}

export const CardCarousel = ({ cards }: CardCarouselProps) => {
  return (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth py-8">
      {cards && cards.map((card) => <CardCard key={card.id} card={card} />)}
    </div>
  );
};
