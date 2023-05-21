import { useSession } from "next-auth/react";
import { DeckCreation } from "~/components/deck/deckCreation";
import { DecksView } from "~/components/deck/decksView";

export const DecksPage = () => {
  const { data: session } = useSession({
    required: true,
  });

  if (!session) {
    return <h1 className="text-4xl font-bold">You need to be logged in</h1>;
  }

  return (
    <div className="space-y-4">
      <DecksView />
      <DeckCreation />
    </div>
  );
};
