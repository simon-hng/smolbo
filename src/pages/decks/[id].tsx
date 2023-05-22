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
          <div key={card.id} className="border-2 border-white p-8">
            <h1>{card.front}</h1>
            <p>{card.back}</p>
          </div>
        ))}
    </div>
  );
};

const DecksViewPage: NextPage = () => {
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

      <CardsCarousel cards={deckQuery.data.cards} />
    </div>
  );
};

export default DecksViewPage;
