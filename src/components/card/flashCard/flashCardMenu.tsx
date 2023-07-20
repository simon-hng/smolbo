import type { Card } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { Card as CardComponent } from "~/components/ui/card";
import { api } from "~/utils/api";
import { CardDialog } from "../cardDialog";

interface Props {
  card: Card;
}

export const CardMenu = ({ card }: Props) => {
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
            <CardDialog card={card}>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 px-4 py-2 outline-none duration-500 hover:bg-slate-100/50"
              >
                Edit
              </button>
            </CardDialog>

            <DropdownMenu.Item asChild>
              <button
                className="flex cursor-pointer items-center gap-2 px-4 py-2 outline-none duration-500 hover:bg-slate-100/50"
                onClick={() =>
                  void toast.promise(
                    navigator.clipboard.writeText(
                      `${card.front}\n---\n${card.back}`
                    ),
                    {
                      loading: "Copying to clipboard",
                      success: "Copied card content to clipboard",
                      error: "Failed to copy to clipboard",
                    }
                  )
                }
              >
                Copy to clipboard
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <button
                className="flex cursor-pointer items-center gap-2 bg-red-900 px-4 py-2 outline-none duration-500 hover:bg-slate-100/50"
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
