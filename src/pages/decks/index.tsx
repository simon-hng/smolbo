import { DeckCreation, DeckCarousel } from "~/components/deck";

export const DecksPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="mb-8 text-4xl">Your decks</h1>

      <DeckCarousel />
      <DeckCreation />
    </div>
  );
};

export default DecksPage;
