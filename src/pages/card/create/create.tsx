import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";

export const Create = () => {
  const { data: session } = useSession({
    required: true,
  });

  const [card, setCard] = useState({
    front: "Card front",
    back: "Card back",
  });

  const cardMutation = api.card.create.useMutation();

  // TODO: Add deck selection

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Create a new card</h1>

      <div className="flex flex-col space-y-4">
        <label className="flex flex-col">
          Deck title
          <textarea
            className="mt-2 rounded border-2 border-white bg-slate-900"
            value={card.front}
            onChange={(e) => {
              return setCard({ ...card, front: e.target.value });
            }}
          />
        </label>

        <label className="flex flex-col">
          Deck description
          <textarea
            className="mt-2 rounded border-2 border-white bg-slate-900"
            defaultValue={card.back}
            onChange={(e) => {
              return setCard({ ...card, back: e.target.value });
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

          cardMutation.mutate(card);
        }}
      >
        create
      </button>
    </div>
  );
};
