import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FlashCard } from "~/components/card";
import {
  type PanInfo,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Card as CardComponent } from "~/components/ui/card";
import { Section } from "~/components/ui/section";
import { useScheduler } from "~/hooks/useScheduler";

const DecksViewPage: NextPage = () => {
  const { query } = useRouter();
  const { cards, isFetching, reviewCard } = useScheduler(query.id as string);
  const controls = useAnimation();

  const handleNextRound = async (isCorrect: boolean) => {
    const directionFactor = isCorrect ? 1 : -1;

    await controls.start({
      x: -directionFactor * 1.25 * window.innerWidth,
      scale: 1.2,
    });

    reviewCard(isCorrect);

    if (cards.length) {
      controls.set({
        opacity: 0,
        x: 0,
        scale: 1,
      });

      await controls.start({
        opacity: 1,
      });
    }
  };

  const [swipeThreshhold, setSwipeThreshhold] = useState(200);
  useEffect(() => {
    setSwipeThreshhold(window.innerWidth / 3);
  }, []);

  const dragEndHandler = (_event: Event, info: PanInfo) => {
    if (Math.abs(info.offset.x) < swipeThreshhold) return;
    const isCorrect = info.offset.x < 0;
    void handleNextRound(isCorrect);
  };

  const x = useMotionValue(0);
  const backgroundColor = useTransform(
    x,
    [-swipeThreshhold, 0, swipeThreshhold],
    ["#064e3b", "#0000000", "#881337"]
  );

  if (isFetching) {
    return (
      <div className="pt-20">
        <Section>
          <CardComponent color="skeleton" />
        </Section>
      </div>
    );
  }

  const card = cards.at(0);
  if (card) {
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
  }

  return (
    <div className="pt-20">
      <Section>
        <h1 className="text-center text-2xl">No more cards</h1>
      </Section>
    </div>
  );
};

export default DecksViewPage;
