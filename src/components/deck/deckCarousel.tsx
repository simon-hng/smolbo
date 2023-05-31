import type { RouterOutputs, RouterInputs } from "~/utils/api";
import { DeckCard, DeckCardSkeleton } from "./deckCard";
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import type { Deck } from "@prisma/client";

interface DeckCarouselCardProps {
  deck: Deck;
  deckDeleteMutation: {
    mutate: (input: string) => void;
  };
}
const DeckCarouselCard = ({
  deck,
  deckDeleteMutation,
}: DeckCarouselCardProps) => {
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });

  return (
    <motion.div ref={ref} style={{ scale: scrollXProgress }}>
      <DeckCard
        key={deck.id}
        deck={deck}
        deckDeleteMutation={deckDeleteMutation}
      />
    </motion.div>
  );
};

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
    <div className="flex space-x-4 overflow-x-auto scroll-smooth py-8">
      {decks &&
        decks.map((deck) => (
          <DeckCarouselCard
            deck={deck}
            deckDeleteMutation={deckDeleteMutation}
          />
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
