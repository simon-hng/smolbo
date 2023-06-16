import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
  PlusIcon,
} from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { api } from "~/utils/api";
import type { Deck } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import useCardRecommendation from "~/hooks/useCardRecommendation";
import { Button } from "../ui/button";
import { Editor, useMonaco } from "@monaco-editor/react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";
import { Card } from "@ui/card";

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

  const {
    getNewRecommendation,
    prevRecommendation,
    nextRecommendation,
    isFetching,
  } = useCardRecommendation(deck.id, card.front);

  const fullConfig = resolveConfig(tailwindConfig);

  const monaco = useMonaco();
  monaco?.editor.defineTheme("default", {
    base: "vs-dark",
    inherit: false,
    rules: [],
    colors: {
      "editor.foreground": fullConfig.theme.color.foreground,
      "editor.background": fullConfig.theme.color.background,
    },
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-lg" />
        <Dialog.Content className="fixed-center container mx-auto">
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
                  defaultLanguage="Markdown"
                  theme="default"
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
                  theme="default"
                  value={card.back}
                  onChange={(value) => {
                    return setCard({ ...card, back: value ?? "" });
                  }}
                />
              </label>

              <div className="flex justify-between">
                <div className="flex divide-x-2 divide-slate-500 overflow-hidden rounded-full border-2 border-slate-500">
                  <Button
                    border="none"
                    color="primary"
                    className="rounded-none pr-2"
                    onClick={() => {
                      setCard({
                        ...card,
                        back: prevRecommendation() ?? card.back,
                      });
                    }}
                  >
                    <ChevronLeftIcon />
                  </Button>

                  <Button
                    border="none"
                    color="primary"
                    className={`rounded-none ${isFetching ? "skeleton" : ""}`}
                    onClick={() => {
                      void getNewRecommendation().then((message) => {
                        setCard({
                          ...card,
                          back: message.data ?? card.back,
                        });
                      });
                    }}
                    disabled={isFetching}
                  >
                    Recommend answer
                  </Button>

                  <Button
                    border="none"
                    color="primary"
                    className="rounded-none pl-2"
                    onClick={() => {
                      setCard({
                        ...card,
                        back: nextRecommendation() ?? card.back,
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
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
