import type { Card } from "@prisma/client";
import * as Separator from "@radix-ui/react-separator";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { MarkdownRenderer } from "../markdown";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useState } from "react";

interface FlashCardDropdownMenuProps {
  card: Card;
}
const FlashCardDropdownMenu = ({ card }: FlashCardDropdownMenuProps) => {
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
      <div className="dialog-close absolute right-4 top-3">
        <DropdownMenu.Trigger>
          <HamburgerMenuIcon />
        </DropdownMenu.Trigger>
      </div>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mt-2 space-y-2 rounded border-2 border-slate-500 bg-slate-900 p-2 text-white">
          <DropdownMenu.Item className="flex cursor-pointer items-center rounded px-2 py-1 hover:bg-slate-700">
            <Pencil1Icon className="mr-2" aria-hidden />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              className="flex cursor-pointer items-center rounded px-2 py-1 hover:bg-slate-700"
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

interface FlashCardProps {
  card: Card;
}

export const FlashCard = ({ card }: FlashCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div key={card.id} className="card relative" onClick={() => setOpen(true)}>
      <FlashCardDropdownMenu card={card} />
      <MarkdownRenderer content={card.front} />

      {open && (
        <div>
          <Separator.Root className="my-4 h-[1px] bg-white" />
          <MarkdownRenderer content={card.back} />
        </div>
      )}
    </div>
  );
};
