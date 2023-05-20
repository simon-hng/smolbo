import { type Card } from "@prisma/client";
import { type PartialBy } from "~/utils/ts-utils";

interface EditorProps {
  card: PartialBy<Card, "id">;
}

export const Editor = ({ card }: EditorProps) => {
  return (
    <div>
      <label>
        Front
        <textarea className="bg-slate-900" value={card.front} />
      </label>

      <label>
        Back
        <textarea className="bg-slate-900" value={card.back} />
      </label>
    </div>
  );
};
