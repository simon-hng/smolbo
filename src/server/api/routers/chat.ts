import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getPineconeIndex } from "../../pinecone";
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
      const pineconeIndex = await getPineconeIndex();
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
