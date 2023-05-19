import { type Card } from "@prisma/client";
import { Editor } from "~/components/editor";
import { api } from "~/utils/api";

export const Create = () => {
  const card: Omit<Card, "id"> = {
    front: "",
    back: "",
  };

  const cardMutation = api.card.create.useMutation();

  return (
    <>
      <Editor card={card} />
      <button onClick={() => cardMutation.mutate(card)}>create</button>
    </>
  );
};
