import { useSession } from "next-auth/react";
import { DeckCard } from "~/components/deck/deckCard";
import { api } from "~/utils/api";

export const DecksPage = () => {
  const { data: session } = useSession({
    required: true,
  });

  const decksQuery = api.deck.getAllForUser.useQuery(
    session?.user.id ?? "public"
  );

  if (!session) {
    return <h1 className="text-4xl font-bold">No session found</h1>;
  }

  return (
    <div className="space-y-4">
      <div>
        {decksQuery.data &&
          decksQuery.data.map((deck) => <DeckCard key={deck.id} deck={deck} />)}
      </div>

      <div className="flex">
        <button className="button">Create Deck</button>
      </div>
    </div>
  );
};
