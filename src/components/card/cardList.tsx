import { type Card } from "@prisma/client";
import { FlashCard } from ".";
import { Card as CardComponent } from "@ui/card";

interface Props {
  cards?: Card[];
}
export const CardList = ({ cards }: Props) => {
  if (!cards) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardComponent variant="skeleton" className="h-16" />
        <CardComponent variant="skeleton" className="h-16" />
        <CardComponent variant="skeleton" className="h-16" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <FlashCard key={card.id} card={card} className="w-full" />
      ))}
    </div>
  );
};
