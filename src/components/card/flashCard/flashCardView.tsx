import type { Card } from "@prisma/client";
import * as Separator from "@radix-ui/react-separator";
import { cx } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { MarkdownRenderer } from "~/components/markdown";

export interface Props {
  card: Pick<Card, "front" | "back">;
  isOpen: boolean;
  className?: string;
}

export const CardView = ({ card, isOpen, className }: Props) => {
  return (
    <div className={cx("h-full", className)}>
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
