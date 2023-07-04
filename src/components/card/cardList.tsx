import { type Card } from "@prisma/client";
import { FlashCard } from ".";

interface Props {
  cards: Card[];
}
export const CardList = ({ cards }: Props) => {
  return (
    <div className="flex min-h-[50vh] snap-x space-x-4 overflow-x-auto scrollbar">
      {cards &&
        cards.map((card) => (
          <FlashCard
            key={card.id}
            card={card}
            className="w-3/4 shrink-0 snap-start snap-normal md:w-1/3"
          />
        ))}
    </div>
  );
};
