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
import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const DecksViewPage: NextPage = () => {
  const { query } = useRouter();
  const { cards, isFetching, reviewCard, reviewedCards } = useScheduler(
    query.id as string
  );
  const [open, setOpen] = useState(false);

  const controls = useAnimation();
  const handleNextRound = async (isCorrect: boolean) => {
    setOpen(false);
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
          <CardComponent color="skeleton" className="min-h-[50vh]" />
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
            <FlashCard
              key={card.id}
              card={card}
              className="min-h-[50vh]"
              openState={[open, setOpen]}
            />
          </motion.div>
        </Section>

        <Section className="fixed bottom-0 w-full">
          <div className="flex w-full divide-x-2 divide-slate-500 overflow-hidden rounded-full border-2 border-slate-500 bg-slate-900/50 backdrop-blur-lg">
            {!open && (
              <button
                className="w-full p-2 text-center"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Show answer
              </button>
            )}
            {!!open && (
              <>
                <button
                  className="w-full bg-[#064e3b] p-2 text-center"
                  onClick={() => void handleNextRound(true)}
                >
                  Easy
                </button>

                <button
                  className="w-full bg-[#881337] p-2 text-center"
                  onClick={() => void handleNextRound(false)}
                >
                  Hard
                </button>
              </>
            )}
          </div>
        </Section>
      </motion.div>
    );
  }

  return (
    <div className="pt-20">
      <Section className="space-y-4">
        <h1 className="mb-8 text-4xl">Session Overview</h1>

        <div className="space-y-4">
          {reviewedCards.map((card) => (
            <FlashCard key={card.id} card={card} />
          ))}
        </div>

        <Button asChild>
          <Link href="/decks">
            <ArrowLeftIcon aria-hidden className="mr-2" />
            To deck overview
          </Link>
        </Button>
      </Section>
    </div>
  );
};

export default DecksViewPage;
