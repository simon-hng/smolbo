import { type Card } from "@prisma/client";
import { type PartialBy } from "~/utils/ts-utils";

interface EditorProps {
  card: PartialBy<Card, "id">;
}

export const Editor = ({ card }: EditorProps) => {
  return (
    <div>
      <h2>Front</h2>

      <h2>Back</h2>
    </div>
  );
};
