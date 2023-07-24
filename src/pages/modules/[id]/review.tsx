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
import {
  ArrowLeftIcon,
  CardStackIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import Head from "next/head";

const Review: NextPage = () => {
  const { query } = useRouter();
  const { cards, isFetching, reviewCard, reviewedCards } = useScheduler(
    query.id as string
  );
  const [isOpen, setOpen] = useState(false);

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
          <CardComponent variant="skeleton" className="h-32" />
        </Section>
      </div>
    );
  }

  const card = cards.at(0);
  if (card) {
    return (
      <>
        <Head>
          <title>Smolbo - Review</title>
        </Head>
        <motion.div
          style={{ backgroundColor }}
          className="flex min-h-screen pt-20"
        >
          <Section>
            <motion.div
              drag="x"
              dragSnapToOrigin
              whileDrag={{ scale: 1.1 }}
              onDragEnd={dragEndHandler}
              animate={controls}
              style={{ x }}
              className="pb-20"
            >
              <FlashCard key={card.id} card={card} isOpen={isOpen} />
            </motion.div>
          </Section>

          <div className="fixed bottom-0 w-full">
            <div className="container mx-auto p-8 lg:p-16">
              <div className="flex w-full divide-x-2 divide-slate-500 overflow-hidden rounded-xl border-2 border-slate-500 bg-slate-900/50 backdrop-blur-lg">
                {!isOpen && (
                  <button
                    className="w-full p-2 text-center duration-500 hover:bg-slate-500"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Show answer
                  </button>
                )}
                {!!isOpen && (
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
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  if (reviewedCards.length === 0 && !card) {
    return (
      <div className="pt-20">
        <Section className="space-y-4">
          <h1 className="mb-8 text-4xl font-semibold">
            No cards due for review
          </h1>

          <div className="flex flex-row space-x-2 overflow-auto">
            <Button variant="primary" asChild>
              <Link href={`/modules/${query.id as string}/chat`}>
                <ChatBubbleIcon aria-hidden className="mr-2" />
                Chat
              </Link>
            </Button>
            <Button variant="primary" asChild>
              <Link href={`/modules/${query.id as string}/overview`}>
                <CardStackIcon aria-hidden className="mr-2" />
                Module Overview
              </Link>
            </Button>
            <Button asChild>
              <Link href="/modules">
                <ArrowLeftIcon aria-hidden className="mr-2" />
                View all modules
              </Link>
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section className="space-y-4">
        <h1 className="mb-8 text-4xl font-semibold">Session Overview</h1>

        <div className="space-y-4">
          {reviewedCards.map((card) => (
            <FlashCard key={card.id} card={card} isOpen={true} />
          ))}
        </div>

        <Button asChild>
          <Link href="/modules">
            <ArrowLeftIcon aria-hidden className="mr-2" />
            View all modules
          </Link>
        </Button>
      </Section>
    </div>
  );
};

export default Review;
