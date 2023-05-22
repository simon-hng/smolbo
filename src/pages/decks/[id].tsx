import { type Card } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

interface CardsCarouselProps {
  cards: Card[];
}

const CardsCarousel = ({ cards }: CardsCarouselProps) => {
  return (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth py-8">
      {cards &&
        cards.map((card) => (
          <div key={card.id} className="border-2 border-slate-500 p-8">
            <h1>{card.front}</h1>
            <p>{card.back}</p>
          </div>
        ))}
    </div>
  );
};

const DecksViewPage: NextPage = () => {
  const { query } = useRouter();

  const deckQuery = api.deck.getById.useQuery(query.id as string, {
    enabled: !!query.id,
  });

  if (deckQuery.isLoading) {
    return (
      <div>
        <h1 className="skeleton mb-2 w-40 text-4xl"></h1>
        <p className="skeleton w-60 animate-pulse"></p>
      </div>
    );
  }

  if (deckQuery.error || !deckQuery.data) {
    return (
      <h1 className="skeleton mb-2 w-40 text-4xl">
        Deck with id {query.id} not found
      </h1>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-4xl">{deckQuery.data.title}</h1>
      <p>{deckQuery.data.description}</p>

      <CardsCarousel cards={deckQuery.data.cards} />
    </div>
  );
};

export default DecksViewPage;
