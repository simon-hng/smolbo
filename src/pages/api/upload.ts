import formidable, { type Fields, type Files, type File } from "formidable";
import { type IncomingMessage } from "http";
import type { NextApiResponse } from "next/types";
import { DirectoryLoader, PDFLoader } from "langchain/document_loaders";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PineconeClient } from "@pinecone-database/pinecone";
import { env } from "~/env.mjs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: IncomingMessage,
  res: NextApiResponse
) {
  const form = formidable({});
  const formParse = form.parse(req) as unknown as Promise<[Fields, Files]>;
  const [fields, data] = await formParse;

  const deckId = fields.deckId?.at(0);
  if (!deckId) {
    res.status(405).json({ success: "false", message: "No deck id provided" });
    return;
  }

  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: env.PINECONE_ENVIRONMENT,
    apiKey: env.PINECONE_API_KEY,
  });

  const files = await Promise.all(
    Object.values(data)
      .filter((file): file is File[] => Array.isArray(file))
      .map((files) => files.at(0))
      .filter((file): file is File => file !== undefined)
      .map((file) => new PDFLoader(file.filepath).load())
  ).then((files) => files.flat());

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunkedData = await textSplitter.splitDocuments(files);

  const embeddings = new OpenAIEmbeddings();
  const pineconeIndex = pinecone.Index(env.PINECONE_INDEX);

  await PineconeStore.fromDocuments(chunkedData, embeddings, {
    pineconeIndex,
    namespace: deckId,
    textKey: "text",
  });

  res.status(200).json({ success: "true" });
}
