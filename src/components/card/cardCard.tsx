import { type Card } from "@prisma/client";
import { Remark } from "react-remark";
import * as Separator from "@radix-ui/react-separator";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

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
      <div className="prose prose-invert">
        <div>
          <Remark>{card.front}</Remark>
        </div>

        {open && (
          <div>
            <Separator.Root className="h-[1px] bg-white" />

            <Remark>{card.back}</Remark>
          </div>
        )}
      </div>
    </div>
  );
};
