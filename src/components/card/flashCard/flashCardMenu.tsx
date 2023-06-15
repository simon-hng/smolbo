import type { Card } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

interface Props {
  card: Card;
  isEdit: boolean;
  setIsEdit: (edit: boolean) => void;
}

export const CardMenu = ({ card, isEdit, setIsEdit }: Props) => {
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
        <DropdownMenu.Content className="mt-2 space-y-2 text-white">
          <DropdownMenu.Item asChild>
            <Button
              color="primary"
              fullWidth
              onClick={() => setIsEdit(!isEdit)}
            >
              <Pencil1Icon className="mr-2" aria-hidden />
              Edit
            </Button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Button
              color="red"
              fullWidth
              onClick={() => void deleteCardMutation.mutate(card.id)}
            >
              <TrashIcon className="mr-2" aria-hidden />
              Delete
            </Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
