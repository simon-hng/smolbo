import { type Deck } from "@prisma/client";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { CardCreation } from "~/components/card";
import { type RouterInputs } from "~/utils/api";
import { Button } from "../ui/button";
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
      <Card>
        <Link href={`/decks/${deck.id}`}>
          <div className="mb-4">
            <h2 className="mb-2 text-2xl">{deck.title}</h2>
            <p>{deck.description}</p>
          </div>
        </Link>

        <div className="flex space-x-2">
          <CardCreation deck={deck} />

          <Button color="primary" href={`decks/edit/${deck.id}`}>
            <Pencil1Icon className="mr-2" aria-hidden />
            Edit
          </Button>

          <Button color="red" fullWidth onClick={() => deleteHandler(deck.id)}>
            <TrashIcon className="mr-2" aria-hidden />
            Delete
          </Button>
        </div>
      </Card>
    </>
  );
};

export const DeckCardSkeleton = () => <Card color="skeleton" />;
