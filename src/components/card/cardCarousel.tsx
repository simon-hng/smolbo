import { type Card } from "@prisma/client";
import { FlashCard } from ".";

interface CardCarouselProps {
  cards: Card[];
}
export const CardCarousel = ({ cards }: CardCarouselProps) => {
  return (
    <div className="flex flex-col space-y-4">
      {cards && cards.map((card) => <FlashCard key={card.id} card={card} />)}
    </div>
  );
};
