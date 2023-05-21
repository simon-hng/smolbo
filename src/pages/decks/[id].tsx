import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const View: NextPage = () => {
  const { query } = useRouter();

  if (typeof query.id !== "string") {
    return <div>Wrong usage of url</div>;
  }

  const deckQuery = api.deck.getById.useQuery(query.id);

  if (deckQuery.isLoading) {
    return <h1>Getting card with id {query.id}</h1>;
  }

  if (deckQuery.error || !deckQuery.data) {
    return <h1>Deck with id {query.id} not found</h1>;
  }

  return (
    <div>
      <h1 className="text-2xl">{deckQuery.data.title}</h1>
      <p>{deckQuery.data.description}</p>
    </div>
  );
};

export default View;
