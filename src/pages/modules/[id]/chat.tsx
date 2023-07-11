import { type NextPage } from "next";
import { useRouter } from "next/router";
import { Chat } from "~/components/chat";
import { Section } from "~/components/ui/section";
import { api } from "~/utils/api";

const ModulesEditPage: NextPage = () => {
  const router = useRouter();

  const moduleQuery = api.module.getById.useQuery(router.query.id as string, {
    enabled: !!router.query.id,
  });

  if (!moduleQuery.data) {
    return (
      <div className="pt-20">
        <Section className="space-y-8">
          <div>
            <div className="skeleton mb-2 w-96 max-w-full text-4xl" />
            <div className="skeleton mb-4 w-16" />
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="h-screen pt-20">
      <Section className="flex h-full flex-col">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-semibold">
            {moduleQuery.data.title}
          </h1>
          <p>{moduleQuery.data.description}</p>
        </div>

        <Chat moduleId={router.query.id as string} />
      </Section>
    </div>
  );
};

export default ModulesEditPage;
