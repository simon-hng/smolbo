import { type Card } from "@prisma/client";
import { FlashCard } from ".";
import { Card as CardComponent } from "@ui/card";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDownIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { InputText } from "../ui/inputText";
import { useState } from "react";

interface Props {
  cards?: Card[];
}
export const CardList = ({ cards }: Props) => {
  const comparators: { [key: string]: (a: Card, b: Card) => number } = {
    dueDate: (a, b) => a.dueDate.getTime() - b.dueDate.getTime(),
    createdAt: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    repetitions: (a, b) => a.repetitions - b.repetitions,
  };
  const [sortBy, setSortBy] = useState("dueDate");

  if (!cards) {
    return (
      <div className="columns-sm gap-8">
        {[...Array(8).keys()].map((i) => (
          <CardComponent key={i} variant="skeleton" className="mb-4 h-16" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-between">
        <InputText placeholder="Search for any card" />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center gap-2 rounded-2xl px-4 py-2 duration-500 hover:bg-slate-100/50">
            Sort
            <CaretDownIcon />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="z-10 flex w-40 flex-col gap-2 overflow-hidden rounded-2xl border-2 border-slate-500 bg-slate-900 py-2 text-white">
            {["dueDate", "createdAt", "repetitions"].map((sortByItem) => (
              <DropdownMenu.Item asChild key={sortByItem}>
                <button
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 outline-none duration-500 hover:bg-slate-100/50"
                  onClick={() => setSortBy(sortByItem)}
                >
                  {sortByItem}
                  {sortBy === sortByItem && <ArrowDownIcon />}
                </button>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="columns-sm gap-8">
        {cards.sort(comparators[sortBy]).map((card) => (
          <FlashCard key={card.id} card={card} className="mb-4 w-full" />
        ))}
      </div>
    </>
  );
};
