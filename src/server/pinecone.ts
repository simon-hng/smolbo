import { PineconeClient } from "@pinecone-database/pinecone";
import { env } from "~/env.mjs";

export const getPineconeClient = async () => {
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: env.PINECONE_ENVIRONMENT,
    apiKey: env.PINECONE_API_KEY,
  });
  return pinecone;
};

export const getPineconeIndex = async () => {
  const pinecone = await getPineconeClient();
  return await pinecone.Index(env.PINECONE_INDEX);
};
