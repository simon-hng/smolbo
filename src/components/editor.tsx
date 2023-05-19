import { type Card } from "@prisma/client";
import { type PartialBy } from "~/utils/ts-utils";
import { Editable, useEditor } from "@wysimark/react";

interface EditorProps {
  card: PartialBy<Card, "id">;
}

export const Editor = ({ card }: EditorProps) => {
  const frontEditor = useEditor({
    initialMarkdown: card.front,
    height: 240,
  });

  const backEditor = useEditor({
    initialMarkdown: card.back,
    height: 240,
  });

  return (
    <div>
      <h2>Front</h2>
      <Editable editor={frontEditor} />

      <h2>Back</h2>
      <Editable editor={backEditor} />
    </div>
  );
};
