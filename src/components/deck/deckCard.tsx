import { type Deck } from "@prisma/client";
import Link from "next/link";

interface DeckCardProps {
  deck: Deck;
  deleteHandler: (id: string) => void;
}

export const DeckCard = ({ deck, deleteHandler }: DeckCardProps) => {
  return (
    <div className="card h-full w-96">
      <Link href={`/decks/${deck.id}`}>
        <div className="mb-4">
          <h2 className="mb-2 text-2xl">{deck.title}</h2>
          <p>{deck.description}</p>
        </div>
      </Link>

      <div className="flex space-x-2">
        <button className="button w-full">Add card</button>
        <Link
          className="button w-full text-center"
          href={`decks/edit/${deck.id}`}
        >
          Edit
        </Link>
        <button
          onClick={() => deleteHandler(deck.id)}
          className="button w-full bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
