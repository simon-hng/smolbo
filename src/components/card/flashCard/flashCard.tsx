import type { Card } from "@prisma/client";
import { useState } from "react";
import { CardView } from "./flashCardView";
import { CardMenu } from "./flashCardMenu";
import { CardEdit } from "./flashCardEdit";
import { Card as CardComponent } from "~/components/ui/card";
import { CardChat } from "./flashCardChat";

interface Props {
  card: Card;
}

export const FlashCard = ({ card: initialCard }: Props) => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [card, setCard] = useState(initialCard);

  return (
    <div key={initialCard.id}>
      <CardComponent color="primary" onClick={() => setOpen(true)}>
        <CardMenu card={card} isEdit={isEdit} setIsEdit={setIsEdit} />

        {isEdit ? (
          <CardEdit card={card} setCard={setCard} />
        ) : (
          <CardView card={card} open={open} />
        )}
      </CardComponent>

      {open && <CardChat card={card} className="mt-4" />}
    </div>
  );
};
