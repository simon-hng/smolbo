import type { Card } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FlashCard } from "~/components/card";
import { api } from "~/utils/api";
import {
  type PanInfo,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Card as CardComponent } from "~/components/ui/card";
import { Section } from "~/components/ui/section";

const DecksViewPage: NextPage = () => {
  const { query } = useRouter();
  const learningSetQuery = api.deck.getLearningSet.useQuery(
    {
      deckId: query.id as string,
      amount: 10,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!query.id,
      onSuccess: (data) => setCard(data[0]),
      onError: () => toast.error("Failed to fetch cards"),
    }
  );
  const [card, setCard] = useState<Card>();
  const cards = learningSetQuery.data;
  const learningSetUpdate = api.deck.updateLearningSet.useMutation();
  const [cardIndex, setCardIndex] = useState(1);
  const controls = useAnimation();

  const updateCardScore = (isCorrect: boolean, card: Card) => {
    if (isCorrect) {
      if (card.repetitions === 0) {
        card.interval = 1;
      } else if (card.repetitions === 1) {
        card.interval = 6;
      } else {
        card.interval *= card.interval;
      }
      card.repetitions++;
    } else {
      card.interval = 1;
      card.repetitions = 0;
    }
  };

  const handleNextRound = async (isCorrect: boolean) => {
    if (!cards) {
      throw new Error("Function handleNextRouund Should not be callable here");
    }

    const lastCard = cardIndex >= cards.length;
    const directionFactor = isCorrect ? 1 : -1;

    await controls.start({
      x: -directionFactor * 1.25 * window.innerWidth,
      scale: 1.2,
    });

    if (lastCard) {
      setCard(undefined);
      learningSetUpdate.mutate(cards);
      toast.success("All cards learned, well done!");
      return;
    }

    setCard(cards[cardIndex]);
    setCardIndex(cardIndex + 1);

    controls.set({
      opacity: 0,
      x: 0,
      scale: 1,
    });

    await controls.start({
      opacity: 1,
    });
  };

  const [swipeThreshhold, setSwipeThreshhold] = useState(200);
  useEffect(() => {
    setSwipeThreshhold(window.innerWidth / 3);
  }, []);

  const dragEndHandler = (_event: Event, info: PanInfo) => {
    if (Math.abs(info.offset.x) < swipeThreshhold || !cards || !card) return;

    const isCorrect = info.offset.x < 0;

    updateCardScore(isCorrect, card);
    void handleNextRound(isCorrect);
  };

  const x = useMotionValue(0);
  const backgroundColor = useTransform(
    x,
    [-swipeThreshhold, 0, swipeThreshhold],
    ["#064e3b", "#0000000", "#881337"]
  );

  if (learningSetQuery.isFetching) {
    return (
      <div className="pt-20">
        <Section>
          <CardComponent color="skeleton" />
        </Section>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="pt-20">
        <Section>
          <h1 className="text-center text-2xl">No more cards</h1>
        </Section>
      </div>
    );
  }

  return (
    <motion.div style={{ backgroundColor }} className="min-h-screen pt-20">
      <Section>
        <motion.div
          drag="x"
          dragSnapToOrigin
          whileDrag={{ scale: 1.1 }}
          onDragEnd={dragEndHandler}
          animate={controls}
          style={{ x }}
        >
          <FlashCard key={card.id} card={card} />
        </motion.div>
      </Section>
    </motion.div>
  );
};

export default DecksViewPage;
