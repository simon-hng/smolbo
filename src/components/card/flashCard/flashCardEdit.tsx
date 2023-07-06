import type { Card } from "@prisma/client";
import * as Separator from "@radix-ui/react-separator";
import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Editor } from "~/components/ui/editor";
import { api } from "~/utils/api";

interface Props {
  card: Card;
  setCard: (card: Card) => void;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
}

export const CardEdit = ({ card, setCard, setIsEdit }: Props) => {
  const ctx = api.useContext();
  const cardUpdateMutation = api.card.update.useMutation({
    onSuccess: () => void ctx.module.invalidate(),
  });

  return (
    <>
      <Editor
        options={{ wordWrap: "on", minimap: { autohide: true } }}
        height="10rem"
        value={card.front}
        onChange={(value) => {
          return setCard({ ...card, front: value ?? "" });
        }}
      />

      <Separator.Root className="my-4 h-[1px] bg-white" />

      <Editor
        options={{ wordWrap: "on", minimap: { autohide: true } }}
        height="10rem"
        value={card.back}
        onChange={(value) => {
          return setCard({ ...card, back: value ?? "" });
        }}
      />

      <Button
        variant="primary"
        onClick={() =>
          void toast
            .promise(cardUpdateMutation.mutateAsync(card), {
              loading: "Updating card",
              success: "Successfully updated card",
              error: "Failed to update card",
            })
            .then(() => setIsEdit(false))
        }
      >
        Save
      </Button>
    </>
  );
};
