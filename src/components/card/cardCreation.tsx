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
  const cardRecommendation = api.card.getBackRecommendation.useQuery(
    card.front,
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (data) => {
        if (!(data.length && data[0]?.message)) return;

        setCard({
          ...card,
          back: data[0].message.content,
        });
      },
    }
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="button flex w-full items-center text-center">
          <PlusIcon aria-hidden className="mr-2" />
          Card
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-content-wrapper">
            <div>
              <div className="flex flex-row justify-between">
                <Dialog.Title className="mb-2 text-2xl">
                  Create a new card
                </Dialog.Title>

                <Dialog.Close className="dialog-close">
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

              <button
                className="button"
                onClick={() => void cardRecommendation.refetch()}
              >
                Recommend
              </button>
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
