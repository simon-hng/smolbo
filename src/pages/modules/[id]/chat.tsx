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

  if (!moduleQuery.isSuccess || !moduleQuery.data) {
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
