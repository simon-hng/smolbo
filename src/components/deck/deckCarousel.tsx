import { DeckCard, DeckCardSkeleton } from "./deckCard";
import { type Deck } from "@prisma/client";

interface DeckCarouselProps {
  query: {
    data: Deck[] | undefined;
    isLoading: boolean;
    error: {
      message: string;
    } | null;
    refetch: () => void;
  };
}
export const DeckCarousel = ({ query }: DeckCarouselProps) => {
  if (query.isLoading) {
    return <DeckCarouselSkeleton />;
  }

  if (query.error) {
    return <div>Failed to get decks</div>;
  }

  const decks = query.data;

  return (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth py-8">
      {decks &&
        decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} query={query} />
        ))}
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
