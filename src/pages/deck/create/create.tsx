import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";

export const Create = () => {
  const { data: session } = useSession({
    required: true,
  });

  const [deck, setDeck] = useState({
    title: "",
    description: "",
  });

  const deckMutation = api.deck.create.useMutation();

  if (deckMutation.isLoading) {
    return <h1 className="text-4xl font-bold">Creating new card</h1>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">
        Create a new Deck to group your cards
      </h1>

      <div className="flex flex-col space-y-4">
        <label className="flex flex-col">
          Deck title
          <textarea
            className="mt-2 rounded border-2 border-white bg-slate-900"
            value={deck.title}
            onChange={(e) => {
              return setDeck({ ...deck, title: e.target.value });
            }}
          />
        </label>

        <label className="flex flex-col">
          Deck description
          <textarea
            className="mt-2 rounded border-2 border-white bg-slate-900"
            defaultValue={deck.description}
            onChange={(e) => {
              return setDeck({ ...deck, description: e.target.value });
            }}
          />
        </label>
      </div>

      <button
        className="rounded-full border-2 border-white px-3 py-1"
        onClick={() => {
          if (!session) {
            return;
          }

          deckMutation.mutate({
            ...deck,
            userId: session.user.id,
          });
        }}
      >
        create
      </button>
    </div>
  );
};