import type { Card } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { Card as CardComponent } from "~/components/ui/card";
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
        <DropdownMenu.Content asChild>
          <CardComponent
            color="glass"
            padding="none"
            className="mt-4 flex flex-col divide-y divide-slate-500 text-white"
          >
            <DropdownMenu.Item asChild>
              <button className="px-4 py-2" onClick={() => setIsEdit(!isEdit)}>
                Edit
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <button
                className="bg-red-900 px-4 py-2"
                onClick={() => void deleteCardMutation.mutate(card.id)}
              >
                Delete
              </button>
            </DropdownMenu.Item>
          </CardComponent>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
