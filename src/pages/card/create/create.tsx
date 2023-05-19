import { type Card } from "@prisma/client";
import { Editor } from "~/components/editor";
import { api } from "~/utils/api";

export const Create = () => {
  const card: Omit<Card, "id"> = {
    front: "Card front",
    back: "Card back",
  };

  const cardMutation = api.card.create.useMutation();

  return (
    <>
      <Editor card={card} />
      <button
        className="rounded-full border-2 border-white px-3 py-1"
        onClick={() => cardMutation.mutate(card)}
      >
        create
      </button>
    </>
  );
};
