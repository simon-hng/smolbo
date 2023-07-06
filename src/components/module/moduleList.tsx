import { api } from "~/utils/api";
import { ModuleCard } from "./moduleCard";

export const ModuleList = () => {
  const decksQuery = api.deck.getAllForUser.useQuery();
  const decks = decksQuery.data;

  if (decksQuery.isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="skeleton h-36 w-full rounded-2xl" />
        <div className="skeleton h-36 w-full rounded-2xl" />
        <div className="skeleton h-36 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {decks && decks.map((deck) => <ModuleCard key={deck.id} deck={deck} />)}
    </div>
  );
};
