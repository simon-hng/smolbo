import { api } from "~/utils/api";
import { DeckCard } from "./deckCard";

export const DeckList = () => {
  const decksQuery = api.deck.getAllForUser.useQuery();
  const decks = decksQuery.data;

  if (decksQuery.isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="skeleton h-36 w-full rounded-2xl" />
        <div className="skeleton h-36 w-full rounded-2xl" />
        <div className="skeleton h-36 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {decks && decks.map((deck) => <DeckCard key={deck.id} deck={deck} />)}
    </div>
  );
};
