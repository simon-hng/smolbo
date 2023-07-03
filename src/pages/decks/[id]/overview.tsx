import type { Card } from "@prisma/client";
import { ChatBubbleIcon, Pencil1Icon, RocketIcon } from "@radix-ui/react-icons";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { CardList, CardCreationDialog } from "~/components/card";
import { UploadDialog } from "~/components/deck/uploadDialog";
import { Button } from "~/components/ui/button";
import { Card as CardComponent } from "~/components/ui/card";
import { Section } from "~/components/ui/section";
import { api } from "~/utils/api";

const DecksEditPage: NextPage = () => {
  const { query } = useRouter();

  const deckQuery = api.deck.getById.useQuery(query.id as string, {
    enabled: !!query.id,
  });

  const countCardsDue = (cards: Card[]) => {
    const now = new Date();
    return cards.filter((card) => card.dueDate < now).length;
  };

  if (deckQuery.isLoading) {
    return (
      <div className="pt-20">
        <Section className="space-y-8">
          <div>
            <h1 className="skeleton mb-2 w-80 text-4xl" />
            <p className="skeleton w-96 animate-pulse" />
            <p className="skeleton w-96 animate-pulse" />
          </div>

          <div className="flex flex-row space-x-2">
            <Button variant="skeleton" />
            <Button variant="skeleton" />
            <Button variant="skeleton" />
            <Button variant="skeleton" />
          </div>

          <div className="flex space-x-4 overflow-auto">
            <CardComponent variant="skeleton" className="h-80 w-64 shrink-0" />
            <CardComponent variant="skeleton" className="h-80 w-64 shrink-0" />
            <CardComponent variant="skeleton" className="h-80 w-64 shrink-0" />
            <CardComponent variant="skeleton" className="h-80 w-64 shrink-0" />
            <CardComponent variant="skeleton" className="h-80 w-64 shrink-0" />
          </div>
        </Section>
      </div>
    );
  }

  if (deckQuery.error || !deckQuery.data || typeof query.id !== "string") {
    return (
      <div className="pt-20">
        <Section>
          <h1 className="skeleton mb-2 w-40 text-4xl font-semibold">
            Failed to load deck
          </h1>
          <p> Deck with id {query.id} not found</p>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section className="space-y-8">
        <div>
          <h1 className="mb-2 text-4xl font-semibold">
            {deckQuery.data.title}
          </h1>
          <p>{deckQuery.data.description}</p>
        </div>

        <div>
          <p>This deck contains {deckQuery.data.cards.length} cards</p>
          {!!countCardsDue(deckQuery.data.cards) && (
            <p>
              <span className="text-red-500">
                {countCardsDue(deckQuery.data.cards)} cards
              </span>{" "}
              are due for review,{" "}
              <span className="text-blue-500">
                {deckQuery.data.cards.length -
                  countCardsDue(deckQuery.data.cards)}{" "}
                cards
              </span>{" "}
              are good
            </p>
          )}
        </div>

        <div className="flex flex-row space-x-2 overflow-auto">
          <Button variant="primary" asChild>
            <Link href={`/decks/${deckQuery.data.id}/chat`}>
              <ChatBubbleIcon aria-hidden className="mr-2" />
              Chat
            </Link>
          </Button>
          <Button variant="primary" asChild>
            <Link href={`/decks/${deckQuery.data.id}`}>
              <RocketIcon aria-hidden className="mr-2" />
              Review
            </Link>
          </Button>
          <UploadDialog deckId={deckQuery.data.id} />
          <CardCreationDialog deck={deckQuery.data} />
          <Button variant="primary" asChild>
            <Link href={`/decks/${deckQuery.data.id}/edit`}>
              <Pencil1Icon aria-hidden className="mr-2" />
              Edit
            </Link>
          </Button>
        </div>

        <CardList cards={deckQuery.data.cards} />
      </Section>
    </div>
  );
};

export default DecksEditPage;
