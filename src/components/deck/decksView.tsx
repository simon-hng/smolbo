import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { DeckCard } from "./deckCard";

export const DecksView = () => {
  const { data: session } = useSession({
    required: true,
  });

  const {
    data: decks,
    isLoading,
    error,
  } = api.deck.getAllForUser.useQuery(session?.user.id ?? "", {
    enabled: Boolean(session?.user.id),
  });

  if (isLoading) {
    return <div>is loading</div>;
  }

  if (error) {
    return (
      <div>
        Failed to get decks
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="flex space-x-4 overflow-x-auto scroll-smooth py-8">
        {decks &&
          decks.map((deck) => (
            <div key={deck.id}>
              <DeckCard deck={deck} />
            </div>
          ))}
      </div>
    </div>
  );
};
