import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Karteikarten</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link className="button hover:bg-slate-700" href="/decks/">
          Browse cards
        </Link>
      </main>
    </>
  );
};

export default Home;
