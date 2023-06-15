import type { Card } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

export const useScheduler = (deckId?: string) => {
  const [cardsToBeReviewed, setCardsToBeReviewed] = useState<Card[]>([]);
  const [reviewedCards, setReviewedCards] = useState<Card[]>([]);

  const learningSetUpdate = api.deck.updateLearningSet.useMutation({
    onError: () => {
      toast.error("Failed to update card progress");
    },
  });

  const { isFetching } = api.deck.getLearningSet.useQuery(
    { deckId: deckId as string },
    {
      enabled: !!deckId,
      refetchOnWindowFocus: false,
      onSuccess: (data) => setCardsToBeReviewed(data),
      onError: () => toast.error("Failed to fetch cards"),
    }
  );

  const reviewCard = (isCorrect: boolean) => {
    const [card, ...remainingCards] = cardsToBeReviewed;
    if (!card) return;

    if (isCorrect) {
      if (card.repetitions === 0) {
        card.interval = 1;
      } else if (card.repetitions === 1) {
        card.interval = 6;
      } else {
        card.interval *= card.interval;
      }
      card.repetitions++;

      const currentDate = new Date();
      card.dueDate = new Date(
        currentDate.getTime() + card.interval * 24 * 60 * 60 * 1000
      );

      setCardsToBeReviewed(remainingCards);

      setReviewedCards([...reviewedCards, card]);
      learningSetUpdate.mutate([card]);
    } else {
      card.interval = 1;
      card.repetitions = 0;

      setCardsToBeReviewed([...remainingCards, card]);
    }
  };

  return {
    reviewCard,
    reviewedCards,
    cards: cardsToBeReviewed,
    isFetching,
  };
};
