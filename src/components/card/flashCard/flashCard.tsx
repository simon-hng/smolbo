import type { Card } from "@prisma/client";
import { CardView } from "./flashCardView";
import { CardMenu } from "./flashCardMenu";
import { Card as CardComponent } from "~/components/ui/card";

interface Props {
  card: Card;
  isOpen: boolean;
  className?: string;
}

export const FlashCard = ({ className, isOpen, card }: Props) => {
  return (
    <CardComponent variant="glass" key={card.id} className={className}>
      <CardMenu card={card} />
      <CardView card={card} isOpen={isOpen} />
    </CardComponent>
  );
};
