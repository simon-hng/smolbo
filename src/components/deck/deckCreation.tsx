import { CardStackPlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { api } from "~/utils/api";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Editor } from "../ui/editor";

export const DeckCreation = () => {
  const ctx = api.useContext();
  const deckCreateMutation = api.deck.create.useMutation({
    onSuccess: () => {
      void ctx.deck.invalidate();
    },
  });

  const [deck, setDeck] = useState({
    title: "",
    description: "",
  });

  const saveHandler = () => {
    deckCreateMutation.mutate({
      ...deck,
    });
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button color="primary">
            <CardStackPlusIcon aria-hidden className="mr-2" />
            Create Deck
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-lg" />
          <Dialog.Content className="fixed-center container mx-auto p-8">
            <Card color="primary">
              <div className="mb-4">
                <div className="flex flex-row justify-between">
                  <Dialog.Title className="mb-2 text-2xl">
                    Create a new deck
                  </Dialog.Title>

                  <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-full p-1 duration-200 hover:bg-slate-800">
                    <Cross2Icon />
                  </Dialog.Close>
                </div>

                <Dialog.Description>
                  Decks offer offer a way of grouping cards
                </Dialog.Description>
              </div>

              <div className="flex flex-col space-y-4">
                <label className="flex flex-col">
                  Deck title
                  <Editor
                    options={{ wordWrap: "on", minimap: { autohide: true } }}
                    height="10rem"
                    value={deck.title}
                    onChange={(value) => {
                      return setDeck({ ...deck, title: value ?? deck.title });
                    }}
                  />
                </label>

                <label className="flex flex-col">
                  Deck description
                  <Editor
                    options={{ wordWrap: "on", minimap: { autohide: true } }}
                    height="10rem"
                    value={deck.description}
                    onChange={(value) => {
                      return setDeck({
                        ...deck,
                        description: value ?? deck.description,
                      });
                    }}
                  />
                </label>

                <div>
                  <Dialog.Close asChild>
                    <Button color="primary" onClick={saveHandler}>
                      save
                    </Button>
                  </Dialog.Close>
                </div>
              </div>
            </Card>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export const DeckCreationSkeleton = () => <Button color="skeleton" />;
