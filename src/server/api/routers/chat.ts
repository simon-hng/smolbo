import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PineconeClient } from "@pinecone-database/pinecone";
import { env } from "~/env.mjs";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { makeConversationalRetrievalQAChain } from "~/server/chains/embeddingsQAChain";


export const chatRouter = createTRPCRouter({
  chatWithModule: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        history: z.array(z.tuple([z.string(), z.string()])),
        moduleId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const pinecone = new PineconeClient();
      await pinecone.init({
        environment: env.PINECONE_ENVIRONMENT,
        apiKey: env.PINECONE_API_KEY,
      });

      const pineconeIndex = pinecone.Index(env.PINECONE_INDEX);
      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
          pineconeIndex,
          textKey: "text",
          namespace: input.moduleId,
        }
      );

      const chain = makeConversationalRetrievalQAChain(vectorStore);

      const history = input.history.flatMap(([q, a]) => [
        new HumanChatMessage(q),
        new AIChatMessage(a),
      ]);
      const response = await chain.call({
        question: input.question.trim().replaceAll("\n", ""),
        chat_history: history,
      });

      return response;
    }),
});
