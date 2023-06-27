import formidable, { type Fields, type Files } from "formidable";
import { type IncomingMessage } from "http";
import type { NextApiResponse } from "next/types";
import { PDFLoader } from "langchain/document_loaders";
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

const createEmbeddings = async (filePath: string, deckId: string) => {
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: env.PINECONE_ENVIRONMENT,
    apiKey: env.PINECONE_API_KEY,
  });

  const loader = new PDFLoader(filePath);
  const rawData = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunkedData = await textSplitter.splitDocuments(rawData);

  const embeddings = new OpenAIEmbeddings();
  const pineconeIndex = pinecone.Index(env.PINECONE_INDEX);

  await PineconeStore.fromDocuments(chunkedData, embeddings, {
    pineconeIndex,
    namespace: deckId,
    textKey: "text",
  });
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
    return
  }

  // TODO: Refactor so that embeddings are not created one file at a time
  for (const file of Object.values(data)) {
    if (Array.isArray(file)) return;
    createEmbeddings(file.filepath, deckId)
  }

  res.status(200).json({ success: "true" });
}
