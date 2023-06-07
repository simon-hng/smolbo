import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
  PlusIcon,
} from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { api } from "~/utils/api";
import { type Deck } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { ensure } from "~/utils/ts-utils";

interface CardCreationProps {
  deck: Deck;
}

export const CardCreation = ({ deck }: CardCreationProps) => {
  const ctx = api.useContext();
  const [card, setCard] = useState({
    front: "",
    back: "",
    deckId: deck.id,
  });
  const cardCreateMutation = api.card.create.useMutation({
    onSuccess: () => {
      toast.success("added card");
      void ctx.deck.invalidate();
    },
    onError: () => {
      toast.error("failed to add card");
    },
  });

  const [recommendations, setRecommendations] = useState<string[]>([]);

  const cardRecommendation = api.card.getBackRecommendation.useQuery(
    {
      deckId: deck.id,
      front: card.front,
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (data) => {
        const message = ensure(data[0]?.message?.content);

        setRecommendations([...recommendations, message]);
        setCard({
          ...card,
          back: message,
        });
      },
      onError: () => {
        toast.error("failed to get recommendation");
      },
    }
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="button flex w-full items-center text-center hover:bg-slate-700">
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
                Card front - Question
                <textarea
                  className="textarea mt-2"
                  defaultValue={card.front}
                  onChange={(e) => {
                    return setCard({ ...card, front: e.target.value });
                  }}
                />
              </label>

              <label className="flex flex-col">
                Card back - Answer
                <textarea
                  className="textarea mt-2 h-48"
                  defaultValue={card.back}
                  onChange={(e) => {
                    return setCard({ ...card, back: e.target.value });
                  }}
                />
              </label>

              <div className="flex space-x-4">
                <button className="button hover:bg-slate-700">
                  <ChevronLeftIcon />
                </button>

                <button
                  className={`button hover:bg-slate-700 ${
                    cardRecommendation.isFetching
                      ? "animate-pulse bg-slate-700"
                      : ""
                  }`}
                  onClick={() => void cardRecommendation.refetch()}
                  disabled={cardRecommendation.isFetching}
                >
                  Recommend answer
                </button>

                <button className="button hover:bg-slate-700">
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className="button hover:bg-slate-700"
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
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
