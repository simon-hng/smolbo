import { type NextPage } from "next";
import { useRouter } from "next/router";
import { Chat } from "~/components/chat";
import { Section } from "~/components/ui/section";
import { api } from "~/utils/api";

const ModulesEditPage: NextPage = () => {
  const { query } = useRouter();

  const moduleQuery = api.module.getById.useQuery(query.id as string, {
    enabled: !!query.id,
  });

  if (moduleQuery.isLoading) {
    return (
      <div className="pt-20">
        <Section className="space-y-8">
          <div>
            <h1 className="skeleton mb-2 w-80 text-4xl" />
            <p className="skeleton w-80 animate-pulse" />
          </div>
        </Section>
      </div>
    );
  }

  if (moduleQuery.error || !moduleQuery.data || typeof query.id !== "string") {
    return (
      <div className="pt-20">
        <Section>
          <h1 className="skeleton mb-2 w-40 text-4xl font-semibold">
            Failed to load module
          </h1>
          <p> Module with id {query.id} not found</p>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section className="space-y-8">
        <div>
          <h1 className="mb-2 text-4xl font-semibold">
            {moduleQuery.data.title}
          </h1>
          <p>{moduleQuery.data.description}</p>
        </div>

        <Chat moduleId={query.id} />
      </Section>
    </div>
  );
};

export default ModulesEditPage;
