import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { ModuleCreationDialog, ModuleList } from "~/components/module";
import { Section } from "~/components/ui/section";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: session, status } = useSession({ required: true });
  const quoteQuery = api.quotes.getDailyQuote.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <Head>
        <title>Smolbo</title>
        <meta name="description" content="Integrated AI Learning Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="pt-20">
        <Section>
          <div className="mb-12">
            {status === "loading" && (
              <h1 className="skeleton mb-4 w-96 max-w-full text-4xl" />
            )}
            {status === "authenticated" && (
              <h1 className="mb-4 text-4xl font-semibold">
                Hello {session?.user.name}, welcome back!
              </h1>
            )}

            {quoteQuery.isLoading && (
              <p className="skeleton mb-2 w-80 max-w-full" />
            )}
            {quoteQuery.data && (
              <p className="mb-2">
                {`"${quoteQuery.data.quote}" - ${quoteQuery.data.person}`}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="mb-4 text-2xl font-semibold">Your Modules</h2>
            <ModuleList />
            <ModuleCreationDialog />
          </div>
        </Section>
      </div>
    </>
  );
};

export default Home;
