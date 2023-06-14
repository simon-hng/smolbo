import type { Card } from "@prisma/client";
import * as Separator from "@radix-ui/react-separator";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  PaperPlaneIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { MarkdownRenderer } from "~/components/markdown";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

interface FlashCardDropdownMenuProps {
  card: Card;
  isEdit: boolean;
  setIsEdit: (edit: boolean) => void;
}
const CardMenu = ({ card, isEdit, setIsEdit }: FlashCardDropdownMenuProps) => {
  const ctx = api.useContext();
  const deleteCardMutation = api.card.deleteById.useMutation({
    onSuccess: () => {
      toast.success("deleted card");
      void ctx.deck.invalidate();
    },
    onError: () => {
      toast.error("failed to delete card");
    },
  });

  return (
    <DropdownMenu.Root>
      <div className="dialog-close float-right">
        <DropdownMenu.Trigger>
          <HamburgerMenuIcon />
        </DropdownMenu.Trigger>
      </div>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mt-2 space-y-2 rounded border-2 border-slate-500 bg-slate-900 p-2 text-white">
          <DropdownMenu.CheckboxItem
            checked={isEdit}
            onCheckedChange={() => setIsEdit(!isEdit)}
            className={clsx(
              "button flex cursor-pointer items-center hover:bg-slate-700",
              isEdit && "bg-slate-700"
            )}
          >
            <Pencil1Icon className="mr-2" aria-hidden />
            Edit
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Item asChild>
            <button
              className="button flex cursor-pointer items-center bg-red-700 hover:bg-red-500"
              onClick={() => void deleteCardMutation.mutate(card.id)}
            >
              <TrashIcon className="mr-2" aria-hidden />
              Delete
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

interface CardEditProps {
  card: Card;
  setCard: (card: Card) => void;
}
const CardEdit = ({ card, setCard }: CardEditProps) => {
  const ctx = api.useContext();
  const cardUpdateMutation = api.card.update.useMutation({
    onSuccess: () => {
      void ctx.deck.invalidate().then(() => toast.success("Updated card"));
    },
    onError: () => {
      toast.error("Failed to update card");
    },
  });

  return (
    <>
      <textarea
        className="textarea mt-2 h-32 w-full"
        defaultValue={card.front}
        onChange={(e) => {
          return setCard({ ...card, front: e.target.value });
        }}
      />

      <Separator.Root className="my-4 h-[1px] bg-white" />

      <textarea
        className="textarea mt-2 h-64 w-full"
        defaultValue={card.back}
        onChange={(e) => {
          return setCard({ ...card, back: e.target.value });
        }}
      />

      <button
        className="button mt-4 hover:bg-slate-700"
        onClick={() => cardUpdateMutation.mutate(card)}
      >
        Save
      </button>
    </>
  );
};

interface CardViewProps {
  card: Card;
  open: boolean;
}

const CardView = ({ card, open }: CardViewProps) => {
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

interface CardChatProps {
  card: Card;
}
const CardChat = ({ card }) => {
  return (
    <div>
      <div className="flex space-x-4">
        <input className="w-full rounded-full border-2 border-slate-500 bg-slate-900 px-4 py-2" />
        <button className="button flex items-center rounded-full">
          <PaperPlaneIcon className="mr-2" /> Send
        </button>
      </div>
    </div>
  );
};

interface FlashCardProps {
  card: Card;
}
export const FlashCard = ({ card: initialCard }: FlashCardProps) => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [card, setCard] = useState(initialCard);

  return (
    <div key={initialCard.id} className="space-y-8">
      <div className="card" onClick={() => setOpen(true)}>
        <CardMenu card={card} isEdit={isEdit} setIsEdit={setIsEdit} />

        {isEdit ? (
          <CardEdit card={card} setCard={setCard} />
        ) : (
          <CardView card={card} open={open} />
        )}
      </div>
      {open && <CardChat card={card} />}
    </div>
  );
};
