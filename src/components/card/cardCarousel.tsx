import { type Card } from "@prisma/client";
import { MarkdownRenderer } from "../markdown";

interface CardCarouselProps {
  cards: Card[];
}

export const CardCarousel = ({ cards }: CardCarouselProps) => {
  return (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth py-8">
      {cards && cards.map((card) => (
      <div>
      <h1>{card.id}</h1>
        <MarkdownRenderer content={card.front}/>
        <MarkdownRenderer content={card.back}/>
      </div>
      )
      )}
    </div>
  );
};
