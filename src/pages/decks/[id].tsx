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
  const [cardIndex, setCardIndex] = useState(1);

  const controls = useAnimation();

  const dragEndHandler = (_event: Event, info: PanInfo) => {
    const swipeThreshhold = window.innerWidth / 2;
    if (Math.abs(info.offset.x) < swipeThreshhold || !cards) return;

    setCard(cards[cardIndex]);
    setCardIndex(cardIndex + 1);

    animateCardExit(info.offset.x);
    setOpen(false);
  };

  const animateCardExit = (offsetX: number) => {
    const directionFactor = offsetX < 0 ? 1 : -1;
    void controls
      .start({
        x: -directionFactor * 1.25 * window.innerWidth,
        scale: 1.2,
      })
      .then(() => {
        controls.set({ x: directionFactor * window.innerWidth });
      })
      .then(() => {
        void controls.start({
          x: 0,
          scale: 1,
        });
      });
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
