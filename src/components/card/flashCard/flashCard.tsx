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
  const [isEdit, setIsEdit] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [card, setCard] = useState(initialCard);

  return (
    <div key={initialCard.id}>
      <CardComponent color="glass">
        <CardMenu card={card} isEdit={isEdit} setIsEdit={setIsEdit} />

        {isEdit ? (
          <CardEdit card={card} setCard={setCard} />
        ) : (
          <CardView card={card} />
        )}
      </CardComponent>

      {isChatOpen && <CardChat card={card} className="mt-4" />}
    </div>
  );
};
