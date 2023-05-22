import { type Card } from "@prisma/client";
import { Remark } from "react-remark";

interface CardCardProps {
  card: Card;
}

export const CardCard = ({ card }: CardCardProps) => {
  return (
    <div key={card.id} className="card h-full w-96">
      <details className="prose prose-invert cursor-pointer">
        <summary className="list-none">
          <Remark>{card.front}</Remark>
        </summary>

        <Remark>{card.back}</Remark>
      </details>
    </div>
  );
};
