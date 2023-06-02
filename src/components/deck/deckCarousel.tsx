import { api } from "~/utils/api";
import { DeckCard, DeckCardSkeleton } from "./deckCard";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export const DeckCarousel = () => {
  const { data: session } = useSession({
    required: true,
  });

  const ctx = api.useContext();
  const decksQuery = api.deck.getAllForUser.useQuery(session?.user.id ?? "", {
    enabled: Boolean(session?.user.id),
  });
  const deckDeleteMutation = api.deck.deleteById.useMutation({
    onSuccess: () => {
      toast.success("Deleted deck");
      void ctx.deck.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete deck");
    },
  });

  const decks = decksQuery.data;

  if (decksQuery.isLoading) {
    return <DeckCarouselSkeleton />;
  }

  return (
    <div className="flex flex-col space-y-4">
      {decks &&
        decks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            deckDeleteMutation={deckDeleteMutation}
          />
        ))}
    </div>
  );
};

export const DeckCarouselSkeleton = () => (
  <div className="flex flex-col space-y-4">
    <DeckCardSkeleton />
    <DeckCardSkeleton />
    <DeckCardSkeleton />
  </div>
);
