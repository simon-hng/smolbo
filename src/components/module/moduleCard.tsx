import { type Deck } from "@prisma/client";
import Link from "next/link";
import { Card } from "../ui/card";

interface DeckCardProps {
  deck: Deck;
}

export const ModuleCard = ({ deck }: DeckCardProps) => {
  return (
    <>
      <Card padding="none" className="flex flex-col">
        <Link href={`/decks/${deck.id}`}>
          <div className="p-4">
            <h2 className="mb-2 text-2xl">{deck.title}</h2>
            <p>{deck.description}</p>
          </div>
        </Link>

        <div className="mt-auto flex divide-x-2 divide-slate-500 border-t-2 border-slate-500">
          <Link
            href={`decks/${deck.id}/chat`}
            className="w-full p-2 text-center duration-500 hover:bg-slate-500"
          >
            Chat
          </Link>
          <Link
            href={`decks/${deck.id}/overview`}
            className="w-full p-2 text-center duration-500 hover:bg-slate-500"
          >
            Overview
          </Link>
          <Link
            href={`decks/${deck.id}/edit`}
            className="w-full p-2 text-center duration-500 hover:bg-slate-500"
          >
            Edit
          </Link>
        </div>
      </Card>
    </>
  );
};
