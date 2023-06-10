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
import clsx from "clsx";

interface FlashCardDropdownMenuProps {
  card: Card;
  isEdit: boolean;
  setIsEdit: (edit: boolean) => void;
}

const FlashCardDropdownMenu = ({
  card,
  isEdit,
  setIsEdit,
}: FlashCardDropdownMenuProps) => {
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

interface FlashCardProps {
  card: Card;
}

export const FlashCard = ({ card }: FlashCardProps) => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCard, setEditCard] = useState(card);
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
    <div key={card.id} className="card relative" onClick={() => setOpen(true)}>
      <FlashCardDropdownMenu
        card={card}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      {isEdit ? (
        <textarea
          className="textarea mt-2 h-32 w-full"
          defaultValue={editCard.front}
          onChange={(e) => {
            return setEditCard({ ...editCard, front: e.target.value });
          }}
        />
      ) : (
        <MarkdownRenderer content={card.front} />
      )}

      {open && (
        <div>
          <Separator.Root className="my-4 h-[1px] bg-white" />

          {isEdit ? (
            <textarea
              className="textarea mt-2 h-64 w-full"
              defaultValue={editCard.back}
              onChange={(e) => {
                return setEditCard({ ...editCard, back: e.target.value });
              }}
            />
          ) : (
            <MarkdownRenderer content={editCard.back} />
          )}
        </div>
      )}

      {isEdit && (
        <button
          className="button mt-4 hover:bg-slate-700"
          onClick={() => cardUpdateMutation.mutate(card)}
        >
          Save
        </button>
      )}
    </div>
  );
};
