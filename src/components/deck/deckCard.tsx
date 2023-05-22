import { type Deck } from "@prisma/client";
import { Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { CardCreation } from "../card/cardCreation";
import { api } from "~/utils/api";

interface DeckCardProps {
  deck: Deck;
}

export const DeckCard = ({ deck }: DeckCardProps) => {
  const deckDeleteMutation = api.deck.deleteById.useMutation();
  const deleteHandler = (deckId: string) => {
    deckDeleteMutation.mutate(deckId);
  };

  return (
    <div className="card h-full w-96">
      <Link href={`/decks/${deck.id}`}>
        <div className="mb-4">
          <h2 className="mb-2 text-2xl">{deck.title}</h2>
          <p>{deck.description}</p>
        </div>
      </Link>

      <div className="flex space-x-2">
        <CardCreation deck={deck} />

        <Link
          className="button flex w-full items-center text-center"
          href={`decks/edit/${deck.id}`}
        >
          <Pencil1Icon className="mr-2" aria-hidden />
          Edit
        </Link>

        <button
          onClick={() => deleteHandler(deck.id)}
          className="button flex w-full items-center bg-red-600"
        >
          <TrashIcon className="mr-2" aria-hidden />
          Delete
        </button>
      </div>
    </div>
  );
};
