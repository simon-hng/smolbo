import { DeckCreation, DeckCarousel } from "~/components/deck";
import { Section } from "~/components/ui/section";

export const DecksPage = () => {
  return (
    <div className="pt-20">
      <Section>
        <div className="space-y-4">
          <h1 className="mb-8 text-4xl">Your decks</h1>

          <DeckCarousel />
          <DeckCreation />
        </div>
      </Section>
    </div>
  );
};

export default DecksPage;
