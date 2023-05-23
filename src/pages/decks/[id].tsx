import { PanInfo, motion } from "framer-motion";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { CardCard } from "~/components/card";
import { api } from "~/utils/api";

const DecksViewPage: NextPage = () => {
  const { query } = useRouter();

  const learningSetQuery = api.deck.getLearningSet.useQuery(
    query.id as string,
    { enabled: !!query.id }
  );

  const cards = learningSetQuery.data ?? [];
  const [cardIndex, setCardIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState(cards[1]);

  const getNextCard = () => {
    setCardIndex(cardIndex + 1);
    setCurrentCard(cards[cardIndex]);
  };

  const dragEndHandler = (_event: Event, info: PanInfo) => {
    const threshhold = 500;
    if (info.offset.x > threshhold) {
      getNextCard();
    }

    if (info.offset.x < threshhold) {
      getNextCard();
    }
  };

  return (
    <div className="overflow-visible py-8">
      {currentCard && (
        <motion.div
          drag="x"
          dragSnapToOrigin
          whileDrag={{ scale: 1.2 }}
          onDragEnd={dragEndHandler}
        >
          <CardCard card={currentCard} />
        </motion.div>
      )}
    </div>
  );
};

export default DecksViewPage;
