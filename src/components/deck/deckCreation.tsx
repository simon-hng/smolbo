import { useSession } from "next-auth/react";
import { CardStackPlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import type { RouterInputs } from "~/utils/api";

interface DeckCreationProps {
  deckCreateMutation: {
    mutate: (deck: RouterInputs["deck"]["create"]) => void;
  };
}

export const DeckCreation = ({ deckCreateMutation }: DeckCreationProps) => {
  const { data: session } = useSession({
    required: true,
  });

  const [deck, setDeck] = useState({
    title: "",
    description: "",
  });

  const saveHandler = () => {
    if (!session) {
      return;
    }

    deckCreateMutation.mutate({
      ...deck,
      userId: session.user.id,
    });
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="button flex items-center hover:bg-slate-700">
            <CardStackPlusIcon aria-hidden className="mr-2" />
            Create Deck
          </button>
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
                <button
                  className="button hover:bg-slate-700"
                  onClick={saveHandler}
                >
                  save
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export const DeckCreationSkeleton = () => (
  <button className="button skeleton w-36 border-none" />
);
