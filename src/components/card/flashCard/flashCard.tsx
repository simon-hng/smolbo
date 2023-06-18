import type { Card } from "@prisma/client";
import { useState } from "react";
import { CardView } from "./flashCardView";
import { CardMenu } from "./flashCardMenu";
import { CardEdit } from "./flashCardEdit";
import { Card as CardComponent } from "~/components/ui/card";

interface Props {
  card: Card;
  className?: string;
}

export const FlashCard = ({ className, card: initialCard }: Props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [card, setCard] = useState(initialCard);

  return (
    <CardComponent color="glass" key={card.id} className={className}>
      <CardMenu card={card} isEdit={isEdit} setIsEdit={setIsEdit} />

      {isEdit ? (
        <CardEdit card={card} setCard={setCard} />
      ) : (
        <CardView card={card} />
      )}
    </CardComponent>
  );
};
