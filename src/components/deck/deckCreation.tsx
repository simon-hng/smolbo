import { CardStackPlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { api } from "~/utils/api";
import { Button } from "../ui/button";

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
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <div className="dialog-content-wrapper">
              <div>
                <div className="flex flex-row justify-between">
                  <Dialog.Title className="mb-2 text-2xl">
                    Create a new deck
                  </Dialog.Title>

                  <Dialog.Close className="dialog-close">
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
                  <input
                    type="text"
                    className="textarea mt-2"
                    value={deck.title}
                    onChange={(e) => {
                      return setDeck({ ...deck, title: e.target.value });
                    }}
                  />
                </label>

                <label className="flex flex-col">
                  Deck description
                  <textarea
                    className="textarea mt-2"
                    defaultValue={deck.description}
                    onChange={(e) => {
                      return setDeck({ ...deck, description: e.target.value });
                    }}
                  />
                </label>
              </div>

              <Dialog.Close asChild>
                <Button color="primary" onClick={saveHandler}>
                  save
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export const DeckCreationSkeleton = () => <Button color="skeleton" />;
