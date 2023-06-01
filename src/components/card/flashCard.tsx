import { type Card } from "@prisma/client";
import * as Separator from "@radix-ui/react-separator";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { MarkdownRenderer } from "../markdown";

const FlashCardDropdownMenu = () => {
  return (
    <DropdownMenu.Root>
      <div className="absolute right-4">
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
          <DropdownMenu.Item className="flex cursor-pointer items-center rounded px-2 py-1 hover:bg-slate-700">
            <TrashIcon className="mr-2" aria-hidden />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

interface FlashCardProps {
  card: Card;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const FlashCard = ({ card, open, setOpen }: FlashCardProps) => {
  return (
    <div key={card.id} className="card relative" onClick={() => setOpen(true)}>
      <FlashCardDropdownMenu />
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
