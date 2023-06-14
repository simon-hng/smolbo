import type { Card } from "@prisma/client";
import * as Separator from "@radix-ui/react-separator";
import { AnimatePresence, motion } from "framer-motion";
import { MarkdownRenderer } from "~/components/markdown";

export interface Props {
  card: Card;
  open: boolean;
}

export const CardView = ({ card, open }: Props) => {
  return (
    <>
      <MarkdownRenderer content={card.front} />

      {open && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Separator.Root className="my-4 h-[1px] bg-white" />

            <MarkdownRenderer content={card.back} />
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};
