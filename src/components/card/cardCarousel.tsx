import { type Card } from "@prisma/client";
import { CardCard } from "./cardCard";
import { useState } from "react";

interface CardProps {
  card: Card;
}
const Card = ({ card }: CardProps) => {
  const [open, setOpen] = useState(false);

  return <CardCard card={card} open={open} setOpen={setOpen} />;
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
