import type { RouterOutputs, RouterInputs } from "~/utils/api";
import { DeckCard, DeckCardSkeleton } from "./deckCard";

interface DeckCarouselProps {
  decksQuery: {
    data: RouterOutputs["deck"]["getAllForUser"] | undefined;
    isLoading: boolean;
  };
  deckDeleteMutation: {
    mutate: (input: RouterInputs["deck"]["deleteById"]) => void;
  };
}
export const DeckCarousel = ({
  decksQuery,
  deckDeleteMutation,
}: DeckCarouselProps) => {
  if (decksQuery.isLoading) {
    return <DeckCarouselSkeleton />;
  }

  const decks = decksQuery.data;

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
