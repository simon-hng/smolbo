import { type Card } from "@prisma/client";
import { type PartialBy } from "~/utils/ts-utils";

interface EditorProps {
  card: PartialBy<Card, "id">;
}

export const Editor = ({ card }: EditorProps) => {
  return (
    <div>
      <h2>Front</h2>
      <textarea className="bg-slate-900">{card.front}</textarea>

      <h2>Back</h2>
      <textarea className="bg-slate-900">{card.back}</textarea>
    </div>
  );
};
