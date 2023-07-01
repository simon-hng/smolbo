import { DeckCreationDialog, DeckList } from "~/components/deck";
import { Section } from "~/components/ui/section";

export const DecksPage = () => {
  return (
    <div className="pt-20">
      <Section className="space-y-4">
        <h1 className="mb-8 text-4xl">Your decks</h1>

        <DeckList />
        <DeckCreationDialog />
      </Section>
    </div>
  );
};

export default DecksPage;
