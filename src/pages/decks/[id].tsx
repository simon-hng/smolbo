import type { Card } from "@prisma/client";
import { type PanInfo, motion, useAnimation } from "framer-motion";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { CardCard } from "~/components/card";
import { api } from "~/utils/api";

const DecksViewPage: NextPage = () => {
  const { query } = useRouter();

  const [card, setCard] = useState<Card>();
  const learningSetQuery = api.deck.getLearningSet.useQuery(
    query.id as string,
    { enabled: !!query.id, onSuccess: (data) => setCard(data[0]) }
  );
  const cards = learningSetQuery.data;
  const [cardIndex, setCardIndex] = useState(1);

  const controls = useAnimation();

  const dragEndHandler = (_event: Event, info: PanInfo) => {
    const swipeThreshhold = window.innerWidth / 2;
    if (Math.abs(info.offset.x) < swipeThreshhold || !cards) return;

    setCard(cards[cardIndex]);
    setCardIndex(cardIndex + 1);

    void controls
      .start({
        x: -1.25 * window.innerWidth,
        scale: 1.2,
      })
      .then(() => {
        controls.set({ x: window.innerWidth });
      })
      .then(() => {
        void controls.start({
          x: 0,
          scale: 1,
        });
      });
  };

  if (learningSetQuery.isLoading) {
    return <h1>Loading</h1>;
  }

  if (!card) {
    return <h1>No more cards</h1>;
  }

  return (
    <div className="overflow-visible py-8">
      <motion.div
        drag="x"
        dragSnapToOrigin
        whileDrag={{ scale: 1.2 }}
        onDragEnd={dragEndHandler}
        animate={controls}
      >
        <CardCard card={card} />
      </motion.div>
    </div>
  );
};

export default DecksViewPage;
