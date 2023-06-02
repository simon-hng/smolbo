import { DeckCreation, DeckCarousel } from "~/components/deck";

export const DecksPage = () => {
  return (
    <div className="space-y-4">
      <DeckCarousel />
      <DeckCreation />
    </div>
  );
};

export default DecksPage;
