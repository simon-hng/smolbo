import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { DeckCard, DeckCardSkeleton } from "./deckCard";

export const DeckCarousel = () => {
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
    return <DeckCarouselSkeleton />;
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
    <div className="flex space-x-4 overflow-x-auto scroll-smooth py-8">
      {decks && decks.map((deck) => <DeckCard key={deck.id} deck={deck} />)}
    </div>
  );
};

export const DeckCarouselSkeleton = () => (
  <div className="flex space-x-4 overflow-x-auto scroll-smooth py-8">
    <DeckCardSkeleton />
    <DeckCardSkeleton />
    <DeckCardSkeleton />
  </div>
);
