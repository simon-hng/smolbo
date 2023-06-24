import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { api } from "~/utils/api";
import type { Deck } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Card } from "@ui/card";
import { Editor } from "../ui/editor";

interface CardCreationDialogProps {
  deck: Deck;
  children?: React.ReactNode;
}

export const CardCreationDialog = ({ deck, children }: CardCreationDialogProps) => {
  const ctx = api.useContext();
  const [card, setCard] = useState({
    front: "",
    back: "",
    deckId: deck.id,
  });

  const trigger = children ?? (
    <Button color="primary">
      <PlusIcon aria-hidden className="mr-2" />
      Card
    </Button>
  );

  const cardCreateMutation = api.card.create.useMutation({
    onSuccess: () => {
      toast.success("added card");
      void ctx.deck.invalidate();
    },
    onError: () => {
      toast.error("failed to add card");
    },
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-lg" />
        <Dialog.Content className="fixed-center container mx-auto p-8">
          <Card color="primary">
            <div className="mb-4">
              <div className="flex flex-row justify-between">
                <Dialog.Title className="mb-2 text-2xl">
                  Create a new card
                </Dialog.Title>

                <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-full p-1 duration-200 hover:bg-slate-800">
                  <Cross2Icon />
                </Dialog.Close>
              </div>

              <Dialog.Description>
                You are adding a card to {deck.title}
              </Dialog.Description>
            </div>

            <div className="flex flex-col space-y-4">
              <label className="flex flex-col">
                Card front
                <Editor
                  options={{ wordWrap: "on", minimap: { autohide: true } }}
                  height="10rem"
                  value={card.front}
                  onChange={(value) => {
                    return setCard({ ...card, front: value ?? "" });
                  }}
                />
              </label>

              <label className="flex flex-col">
                Card back - Answer
                <Editor
                  options={{ wordWrap: "on", minimap: { autohide: true } }}
                  height="10rem"
                  defaultLanguage="markdown"
                  onChange={(value) => {
                    return setCard({ ...card, back: value ?? "" });
                  }}
                />
              </label>

              <Dialog.Close asChild>
                <Button
                  color="primary"
                  onClick={() => {
                    cardCreateMutation.mutate({
                      ...card,
                    });

                    setCard({
                      ...card,
                      front: "",
                      back: "",
                    });
                  }}
                >
                  save
                </Button>
              </Dialog.Close>
            </div>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
