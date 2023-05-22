import { type Card } from "@prisma/client";

interface CardCarouselProps {
  cards: Card[];
}

export const CardCarousel = ({ cards }: CardCarouselProps) => {
  return (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth py-8">
      {cards &&
        cards.map((card) => (
          <div key={card.id} className="border-2 border-slate-500 p-8">
            <h1>{card.front}</h1>
            <p>{card.back}</p>
          </div>
        ))}
    </div>
  );
};
