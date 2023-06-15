import { type Deck } from "@prisma/client";
import Link from "next/link";
import { CardCreation } from "~/components/card";
import { type RouterInputs } from "~/utils/api";
import { Card } from "../ui/card";

interface DeckCardProps {
  deck: Deck;
  deckDeleteMutation: {
    mutate: (input: RouterInputs["deck"]["deleteById"]) => void;
  };
}

export const DeckCard = ({ deck, deckDeleteMutation }: DeckCardProps) => {
  const deleteHandler = (deckId: string) => {
    deckDeleteMutation.mutate(deckId);
  };

  return (
    <>
      <Card padding="none">
        <Link href={`/decks/${deck.id}`}>
          <div className="p-4">
            <h2 className="mb-2 text-2xl">{deck.title}</h2>
            <p>{deck.description}</p>
          </div>
        </Link>

        <div className="flex divide-x divide-slate-500 border-t-2 border-slate-500">
          <CardCreation deck={deck}>
            <button className="w-full p-2 text-center">Add card</button>
          </CardCreation>

          <Link
            className="w-full p-2 text-center"
            href={`decks/edit/${deck.id}`}
          >
            Edit
          </Link>

          <button
            className="w-full bg-red-900 p-2 text-center "
            onClick={() => deleteHandler(deck.id)}
          >
            Delete
          </button>
        </div>
      </Card>
    </>
  );
};

export const DeckCardSkeleton = () => <Card color="skeleton" />;
