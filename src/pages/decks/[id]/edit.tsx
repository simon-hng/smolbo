import { type NextPage } from "next";
import { useRouter } from "next/router";
import { CardCarousel, CardCreationDialog } from "~/components/card";
import { UploadDialog } from "~/components/deck/uploadDialog";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Section } from "~/components/ui/section";
import { api } from "~/utils/api";

const DecksEditPage: NextPage = () => {
  const { query } = useRouter();

  const deckQuery = api.deck.getById.useQuery(query.id as string, {
    enabled: !!query.id,
  });

  if (deckQuery.isLoading) {
    return (
      <div className="pt-20">
        <Section className="space-y-8">
          <div>
            <h1 className="skeleton mb-2 w-80 text-4xl" />
            <p className="skeleton w-80 animate-pulse" />
          </div>

          <div className="flex flex-row space-x-2">
            <Button variant="skeleton" />
            <Button variant="skeleton" />
          </div>

          <div className="space-y-4">
            <Card variant="skeleton" />
            <Card variant="skeleton" />
            <Card variant="skeleton" />
          </div>
        </Section>
      </div>
    );
  }

  if (deckQuery.error || !deckQuery.data || typeof query.id !== "string") {
    return (
      <div className="pt-20">
        <Section>
          <h1 className="skeleton mb-2 w-40 text-4xl">Failed to load deck</h1>
          <p> Deck with id {query.id} not found</p>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section className="space-y-8">
        <div>
          <h1 className="mb-2 text-4xl">{deckQuery.data.title}</h1>
          <p>{deckQuery.data.description}</p>
        </div>

        <div className="flex flex-row space-x-2">
          <CardCreationDialog deck={deckQuery.data} />

          <UploadDialog deckId={deckQuery.data.id} />
        </div>

        <CardCarousel cards={deckQuery.data.cards} />
      </Section>
    </div>
  );
};

export default DecksEditPage;
