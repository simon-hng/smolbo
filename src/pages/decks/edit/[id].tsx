import { type NextPage } from "next";
import { useRouter } from "next/router";
import { CardCarousel, CardCreation } from "~/components/card";
import { api } from "~/utils/api";

const DecksEditPage: NextPage = () => {
  const { query } = useRouter();

  const deckQuery = api.deck.getById.useQuery(query.id as string, {
    enabled: !!query.id,
  });

  if (deckQuery.isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="skeleton mb-2 w-80 text-4xl" />
          <p className="skeleton w-80 animate-pulse" />
        </div>

        <div className="skeleton button" />

        <div className="space-y-4">
          <div className="card skeleton" />
          <div className="card skeleton" />
          <div className="card skeleton" />
        </div>
      </div>
    );
  }

  if (deckQuery.error || !deckQuery.data) {
    return (
      <div>
        <h1 className="skeleton mb-2 w-40 text-4xl">Failed to load deck</h1>
        <p> Deck with id {query.id} not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl">{deckQuery.data.title}</h1>
        <p>{deckQuery.data.description}</p>
      </div>

      <CardCreation deck={deckQuery.data} />

      <CardCarousel cards={deckQuery.data.cards} />
    </div>
  );
};

export default DecksEditPage;
