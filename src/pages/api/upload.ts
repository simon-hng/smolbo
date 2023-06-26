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

  if (!Array.isArray(data.file)) {
    throw new Error("You need to send one single file");
  }

  const deckId = fields.deckId?.at(0);
  const file = data.file.at(0);
  if (!deckId || !file || file.mimetype !== "application/pdf") {
    throw new Error(
      "Wrong usage of api. You need to send a single pdf and provide a deckId"
    );
  }

  await createEmbeddings(file.filepath, deckId);

  res.status(200).json({ success: "true" });
}
