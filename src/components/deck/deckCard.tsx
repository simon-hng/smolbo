import { type Deck } from "@prisma/client";
import Link from "next/link";

interface DeckCardProps {
  deck: Deck;
}

export const DeckCard = ({ deck }: DeckCardProps) => (
  <Link href={`/deck/view/${deck.id}`}>
    <div className="space-y-2 card">
      <h2 className="text-2xl">{deck.title}</h2>
      <p>{deck.description}</p>
    </div>
  </Link>
);
