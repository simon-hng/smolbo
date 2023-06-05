import type { Card } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { FlashCard } from "~/components/card";
import { api } from "~/utils/api";
import { type PanInfo, motion, useAnimation } from "framer-motion";

const DecksViewPage: NextPage = () => {
  const { query } = useRouter();

  const [card, setCard] = useState<Card>();
  const [open, setOpen] = useState(false);

  const learningSetQuery = api.deck.getLearningSet.useQuery(
    {
      deckId: query.id as string,
      amount: 10,
    },
    {
      enabled: !!query.id,
      onSuccess: (data) => setCard(data[0]),
      onError: () => toast.error("Failed to fetch cards"),
    }
  );
  const cards = learningSetQuery.data;

  const learningSetUpdate = api.deck.updateLearningSet.useMutation();
  const [cardIndex, setCardIndex] = useState(1);

  const controls = useAnimation();

  const updateCard = (isCorrect: boolean, card: Card) => {
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

  const animateCardExit = (offsetX: number, lastCard = false) => {
    const directionFactor = offsetX < 0 ? 1 : -1;
    void controls
      .start({
        x: -directionFactor * 1.25 * window.innerWidth,
        scale: 1.2,
      })
      .then(() => {
        if (!lastCard) {
          controls.set({ x: directionFactor * window.innerWidth });
        }
      })
      .then(() => {
        if (!lastCard) {
          void controls.start({
            x: 0,
            scale: 1,
          });
        }
      });
  };

  const endHandler = () => {
    if (!cards) return;
    learningSetUpdate.mutate(cards);
  };

  const dragEndHandler = (_event: Event, info: PanInfo) => {
    const swipeThreshhold = window.innerWidth / 3;
    if (Math.abs(info.offset.x) < swipeThreshhold || !cards || !card) return;

    const isCorrect = info.offset.x < 0;
    updateCard(isCorrect, card);

    if (cardIndex >= cards.length) {
      animateCardExit(info.offset.x, true);
      setCard(undefined);
      endHandler();
      return;
    }

    setCard(cards[cardIndex]);
    setCardIndex(cardIndex + 1);
    animateCardExit(info.offset.x);
    setOpen(false);
  };

  if (learningSetQuery.isFetching) {
    return <div className="card skeleton h-48"></div>;
  }

  if (!card) {
    return <h1 className="text-center text-2xl">No more cards</h1>;
  }

  return (
    <motion.div
      drag="x"
      dragSnapToOrigin
      whileDrag={{ scale: 1.1 }}
      onDragEnd={dragEndHandler}
      animate={controls}
    >
      <FlashCard card={card} open={open} setOpen={setOpen} />
    </motion.div>
  );
};

export default DecksViewPage;
