import { type NextPage } from "next";
import { useRouter } from "next/router";
import { Editor } from "~/components/editor";
import { api } from "~/utils/api";

const Edit: NextPage = () => {
  const { query } = useRouter();

  if (typeof query.id !== "string") {
    return <div>Wrong usage of url</div>;
  }

  const card = api.card.getById.useQuery(query.id);

  if (!card.data) {
    return <h1>Card with id {query.id} not found</h1>;
  }

  return <Editor card={card.data} />;
};

export default Edit;
