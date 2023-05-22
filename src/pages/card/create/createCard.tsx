import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

const SelectDeck = () => {
  const { data: session } = useSession({
    required: true,
  });

  const { data: decks } = api.deck.getAllForUser.useQuery(
    session?.user.id ?? "",
    {
      enabled: Boolean(session?.user.id),
    }
  );

  return (
    <label>
      <option>Select a deck to add your card to</option>
      <select name="deck" className="bg-slate-900">
        {decks &&
          decks.map((deck) => (
            <option key={deck.id} value={deck.id}>
              {deck.title}
            </option>
          ))}
      </select>
    </label>
  );
};

export const CreateCardPage: NextPage = () => {
  return (
    <div className="flex flex-col space-y-4">
      <SelectDeck />

      <label className="flex flex-col">
        Front
        <textarea className="rounded border-2 border-white bg-slate-900"></textarea>
      </label>
    </div>
  );
};
