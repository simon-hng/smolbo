import { type Card } from "@prisma/client";
import { useState } from "react";
import { FlashCard } from ".";

interface CardProps {
  card: Card;
}
const Card = ({ card }: CardProps) => {
  const [open, setOpen] = useState(false);

  return <FlashCard card={card} open={open} setOpen={setOpen} />;
};

interface CardCarouselProps {
  cards: Card[];
}
export const CardCarousel = ({ cards }: CardCarouselProps) => {
  return (
    <div className="flex flex-col space-y-4">
      {cards && cards.map((card) => <Card key={card.id} card={card} />)}
    </div>
  );
};
