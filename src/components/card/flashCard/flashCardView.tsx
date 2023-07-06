import type { Card } from "@prisma/client";
import * as Separator from "@radix-ui/react-separator";
import { cx } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { type Dispatch, type SetStateAction, useState } from "react";
import { MarkdownRenderer } from "~/components/markdown";

export interface Props {
  card: Pick<Card, "front" | "back">;
  openState?: [boolean, Dispatch<SetStateAction<boolean>>];
  className?: string;
}

export const CardView = ({ card, openState, className }: Props) => {
  const newOpenState = useState(false);
  const [isOpen, setIsOpen] = openState ?? newOpenState;

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={cx("h-full cursor-pointer", className)}
    >
      <MarkdownRenderer content={card.front} />

      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Separator.Root className="my-4 h-[2px] bg-slate-500" />

            <MarkdownRenderer content={card.back} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
