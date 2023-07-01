import { type Card } from "@prisma/client";
import { FlashCard } from ".";

interface Props {
  cards: Card[];
}
export const CardList = ({ cards }: Props) => {
  return (
    <div className="flex flex-col space-y-4">
      {cards && cards.map((card) => <FlashCard key={card.id} card={card} />)}
    </div>
  );
};