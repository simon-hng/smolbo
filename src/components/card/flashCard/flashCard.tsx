import type { Card } from "@prisma/client";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { CardView } from "./flashCardView";
import { CardMenu } from "./flashCardMenu";
import { CardEdit } from "./flashCardEdit";
import { Button } from "~/components/ui/button";

interface CardChatProps {
  card: Card;
}

const CardChat = ({ card }) => {
  return (
    <div>
      <div className="flex space-x-4">
        <input className="w-full rounded-full border-2 border-slate-500 bg-slate-900 px-4 py-2" />
        <Button color="primary">
          <PaperPlaneIcon className="mr-2" /> Send
        </Button>
      </div>
    </div>
  );
};

interface FlashCardProps {
  card: Card;
}

export const FlashCard = ({ card: initialCard }: FlashCardProps) => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [card, setCard] = useState(initialCard);

  return (
    <div key={initialCard.id} className="space-y-8">
      <div className="card" onClick={() => setOpen(true)}>
        <CardMenu card={card} isEdit={isEdit} setIsEdit={setIsEdit} />

        {isEdit ? (
          <CardEdit card={card} setCard={setCard} />
        ) : (
          <CardView card={card} open={open} />
        )}
      </div>
      {open && <CardChat card={card} />}
    </div>
  );
};
