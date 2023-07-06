import { type Card } from "@prisma/client";
import { FlashCard } from ".";

interface Props {
  cards: Card[];
}
export const CardList = ({ cards }: Props) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards &&
        cards.map((card) => (
          <FlashCard key={card.id} card={card} className="w-full" />
        ))}
    </div>
  );
};
