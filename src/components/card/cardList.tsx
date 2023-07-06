import { type Card } from "@prisma/client";
import { FlashCard } from ".";
import { Card as CardComponent } from "@ui/card";

interface Props {
  cards?: Card[];
}
export const CardList = ({ cards }: Props) => {
  if (!cards) {
    return (
      <div className="columns-sm gap-8">
        <CardComponent variant="skeleton" className="mb-4 h-16" />
        <CardComponent variant="skeleton" className="mb-4 h-16" />
        <CardComponent variant="skeleton" className="mb-4 h-16" />
      </div>
    );
  }

  return (
    <div className="columns-sm gap-8">
      {cards.map((card) => (
        <FlashCard key={card.id} card={card} className="mb-4 w-full" />
      ))}
    </div>
  );
};
