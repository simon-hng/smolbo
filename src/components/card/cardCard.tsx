import { type Card } from "@prisma/client";
import * as Separator from "@radix-ui/react-separator";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { MarkdownRenderer } from "../markdown";

const CardCardDropdownMenu = () => {
  return (
    <DropdownMenu.Root>
      <div className="mb-4 flex items-center justify-end">
        <DropdownMenu.Trigger>
          <HamburgerMenuIcon />
        </DropdownMenu.Trigger>
      </div>

      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Edit card</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

interface CardCardProps {
  card: Card;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CardCard = ({ card, open, setOpen }: CardCardProps) => {
  return (
    <div key={card.id} className="card" onClick={() => setOpen(true)}>
      <CardCardDropdownMenu />
      <MarkdownRenderer content={card.front} />

      {open && (
        <div>
          <Separator.Root className="h-[1px] bg-white" />
          <MarkdownRenderer content={card.back} />
        </div>
      )}
    </div>
  );
};
