import { type Deck } from "@prisma/client";

interface DeckCardProps {
  deck: Deck;
}

export const DeckCard = ({ deck }: DeckCardProps) => (
  <div className="space-y-2 rounded border-2 border-white bg-slate-900 p-4">
    <h2 className="text-2xl">{deck.title}</h2>
    <p>{deck.description}</p>
  </div>
);
