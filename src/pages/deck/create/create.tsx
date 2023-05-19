import { type Deck } from "@prisma/client";
import { Editor } from "~/components/editor";
import { api } from "~/utils/api";

export const Create = () => {
  const deck: Omit<Deck, "id"> = {
    title: "",
    description: "",
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
