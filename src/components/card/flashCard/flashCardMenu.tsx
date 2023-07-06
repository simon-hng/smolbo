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
    onSuccess: () => ctx.module.invalidate(),
  });

  return (
    <DropdownMenu.Root>
      <div className="dialog-close float-right pl-4">
        <DropdownMenu.Trigger>
          <HamburgerMenuIcon />
        </DropdownMenu.Trigger>
      </div>

      <DropdownMenu.Portal>
        <DropdownMenu.Content asChild>
          <CardComponent
            variant="glass"
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
                onClick={() =>
                  void toast.promise(deleteCardMutation.mutateAsync(card.id), {
                    loading: "Deleting card",
                    success: "Successfully deleted card",
                    error: "Failed to delete card",
                  })
                }
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
