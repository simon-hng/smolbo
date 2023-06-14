import type { Card } from "@prisma/client";
import * as Separator from "@radix-ui/react-separator";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

interface Props {
  card: Card;
  setCard: (card: Card) => void;
}

export const CardEdit = ({ card, setCard }: Props) => {
  const ctx = api.useContext();
  const cardUpdateMutation = api.card.update.useMutation({
    onSuccess: () => {
      void ctx.deck.invalidate().then(() => toast.success("Updated card"));
    },
    onError: () => {
      toast.error("Failed to update card");
    },
  });

  return (
    <>
      <textarea
        className="textarea mt-2 h-32 w-full"
        defaultValue={card.front}
        onChange={(e) => {
          return setCard({ ...card, front: e.target.value });
        }}
      />

      <Separator.Root className="my-4 h-[1px] bg-white" />

      <textarea
        className="textarea mt-2 h-64 w-full"
        defaultValue={card.back}
        onChange={(e) => {
          return setCard({ ...card, back: e.target.value });
        }}
      />

      <button
        className="button mt-4 hover:bg-slate-700"
        onClick={() => cardUpdateMutation.mutate(card)}
      >
        Save
      </button>
    </>
  );
};
