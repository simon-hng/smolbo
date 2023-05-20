import { useSession } from "next-auth/react";
import { DeckCard } from "~/components/deck/deckCard";
import { api } from "~/utils/api";

export const Browse = () => {
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
    <>
      {decksQuery.data &&
        decksQuery.data.map((deck) => <DeckCard key={deck.id} deck={deck} />)}
    </>
  );
};
