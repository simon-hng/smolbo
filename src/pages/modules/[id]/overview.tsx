import type { Card, Module } from "@prisma/client";
import { ChatBubbleIcon, Pencil1Icon, RocketIcon } from "@radix-ui/react-icons";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { CardList, CardCreationDialog } from "~/components/card";
import { UploadDialog } from "~/components/module/uploadDialog";
import { Button } from "~/components/ui/button";
import { Section } from "~/components/ui/section";
import { api } from "~/utils/api";

interface ModuleInformation extends Module {
  cards: Card[];
  vectorCount: number;
}
interface ModuleSummaryProps {
  module?: ModuleInformation;
}
const ModuleSummary = ({ module }: ModuleSummaryProps) => {
  const countCardsDue = (cards: Card[]) => {
    const now = new Date();
    return cards.filter((card) => card.dueDate < now).length;
  };

  if (!module) {
    return (
      <div className="mb-12 space-y-4">
        <div className="skeleton mb-2 w-96 max-w-full text-4xl" />
        <div className="skeleton mb-4 w-16" />
        <div className="skeleton h-12 w-80" />
        <div className="scrollbar mb-12 flex flex-row space-x-2 overflow-x-auto">
          {[...Array(5).keys()].map((i) => (
            <Button variant="skeleton" key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 space-y-4">
      <div>
        <h1 className="mb-2 text-4xl font-semibold">{module.title}</h1>
        <p>{module.description}</p>
      </div>
      <div>
        <p>
          This module contains {module.cards.length} cards and{" "}
          {module.vectorCount} vectors
        </p>
        {!!countCardsDue(module.cards) && (
          <p>
            <span className="text-red-500">
              {countCardsDue(module.cards)} cards
            </span>{" "}
            are due for review,{" "}
            <span className="text-blue-500">
              {module.cards.length - countCardsDue(module.cards)} cards
            </span>{" "}
            are good
          </p>
        )}
      </div>
      <div className="scrollbar mb-12 flex flex-row space-x-2 overflow-x-auto">
        <Button variant="primary" asChild>
          <Link href={`/modules/${module.id}/chat`}>
            <ChatBubbleIcon aria-hidden className="mr-2" />
            Chat
          </Link>
        </Button>
        <Button variant="primary" asChild>
          <Link href={`/modules/${module.id}`}>
            <RocketIcon aria-hidden className="mr-2" />
            Review
          </Link>
        </Button>
        <UploadDialog moduleId={module.id} />
        <CardCreationDialog module={module} />
        <Button variant="primary" asChild>
          <Link href={`/modules/${module.id}/edit`}>
            <Pencil1Icon aria-hidden className="mr-2" />
            Edit
          </Link>
        </Button>
      </div>
    </div>
  );
};

const ModulesEditPage: NextPage = () => {
  const { query } = useRouter();

  const moduleQuery = api.module.getById.useQuery(query.id as string, {
    enabled: !!query.id,
  });

  return (
    <div className="pt-20">
      <Section>
        <ModuleSummary module={moduleQuery.data as ModuleInformation} />
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Your Flashcards</h2>
          <CardList cards={moduleQuery.data?.cards} />
        </div>
      </Section>
    </div>
  );
};

export default ModulesEditPage;
