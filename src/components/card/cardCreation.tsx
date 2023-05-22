import { useSession } from "next-auth/react";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { api } from "~/utils/api";
import { type Deck } from "@prisma/client";
import { useState } from "react";

interface CardCreationProps {
  deck: Deck;
}

export const CardCreation = ({ deck }: CardCreationProps) => {
  const { data: session } = useSession({
    required: true,
  });

  const [card, setCard] = useState({
    front: "",
    back: "",
    deckId: deck.id,
  });
  const cardCreateMutation = api.card.create.useMutation();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="button flex w-full items-center text-center">
          <PlusIcon aria-hidden className="mr-2" />
          Card
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900 opacity-80" />
        <Dialog.Content className="fixed-center min-w-full">
          <div className="mx-12 space-y-4 rounded border-2 border-white bg-slate-900 p-4 text-white">
            <div>
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
                <textarea
                  className="textarea mt-2"
                  defaultValue={card.front}
                  onChange={(e) => {
                    return setCard({ ...card, front: e.target.value });
                  }}
                />
              </label>

              <label className="flex flex-col">
                Card back
                <textarea
                  className="textarea mt-2"
                  defaultValue={card.back}
                  onChange={(e) => {
                    return setCard({ ...card, back: e.target.value });
                  }}
                />
              </label>
            </div>

            <Dialog.Close asChild>
              <button
                className="button"
                onClick={() => {
                  if (!session) {
                    return;
                  }

                  cardCreateMutation.mutate({
                    ...card,
                  });
                }}
              >
                save
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
