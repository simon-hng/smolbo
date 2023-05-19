import { type Card } from "@prisma/client";
import { Editable, useEditor } from "@wysimark/react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { z } from "zod";
import { api } from "~/utils/api";

interface EditorProps {
  card: Card;
}

const Editor = ({ card }: EditorProps) => {
  const frontEditor = useEditor({
    initialMarkdown: card.front,
    height: 240,
  });

  const backEditor = useEditor({
    initialMarkdown: card.back,
    height: 240,
  });

  return (
    <div>
      <h2>Front</h2>
      <Editable editor={frontEditor} />

      <h2>Back</h2>
      <Editable editor={backEditor} />
    </div>
  );
};

const Edit: NextPage = () => {
  const { query } = useRouter();

  const id = z.string().parse(query.id);
  const card = api.card.getById.useQuery(id);

  if (card.data) {
    return <Editor card={card.data} />;
  }

  return <h1>Card with id {id} not found</h1>;
};

export default Edit;
