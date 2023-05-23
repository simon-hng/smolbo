import { type Card } from "@prisma/client";
import { useState } from "react";
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
}

export const CardCard = ({ card }: CardCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div key={card.id} className="card h-full w-96">
      <CardCardDropdownMenu />
      <div className="prose prose-invert">
        <div className="cursor-pointer" onClick={() => setOpen(true)}>
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
