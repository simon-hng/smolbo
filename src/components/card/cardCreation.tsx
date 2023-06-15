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
import useCardRecommendation from "~/hooks/useCardRecommendation";
import { Button } from "../ui/button";

interface CardCreationProps {
  deck: Deck;
  children?: React.ReactNode;
}

export const CardCreation = ({ deck, children }: CardCreationProps) => {
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

  const { getNewRecommendation, recommendations, isFetching } =
    useCardRecommendation(deck.id, card.front);
  const [recI, setRecI] = useState(0);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

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
                  className="textarea mt-2 h-32"
                  defaultValue={card.front}
                  onChange={(e) => {
                    return setCard({ ...card, front: e.target.value });
                  }}
                />
              </label>

              <label className="flex flex-col">
                Card back - Answer
                <textarea
                  className="textarea mt-2 h-64"
                  defaultValue={card.back}
                  onChange={(e) => {
                    return setCard({ ...card, back: e.target.value });
                  }}
                />
              </label>

              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    color="primary"
                    disabled={recI == 0}
                    onClick={() => {
                      setRecI(recI - 1);
                      setCard({
                        ...card,
                        back: recommendations.at(recI) ?? card.back,
                      });
                    }}
                  >
                    <ChevronLeftIcon />
                  </Button>

                  <Button
                    color="primary"
                    onClick={() => {
                      void getNewRecommendation().then((api) => {
                        setRecI(recI + 1);
                        setCard({
                          ...card,
                          back: api.data ?? card.back,
                        });
                      });
                    }}
                    disabled={isFetching}
                  >
                    Recommend answer
                  </Button>

                  <Button
                    color="primary"
                    disabled={
                      recommendations.length === 0 ||
                      recI == recommendations.length - 1
                    }
                    onClick={() => {
                      setRecI(recI + 1);
                      setCard({
                        ...card,
                        back: recommendations.at(recI) ?? card.back,
                      });
                    }}
                  >
                    <ChevronRightIcon />
                  </Button>
                </div>

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
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
