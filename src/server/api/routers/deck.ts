import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain";
import { PineconeClient } from "@pinecone-database/pinecone";
import { env } from "~/env.mjs";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
Add any page numbers that you sourced or slide numbers if no page numbers are available.

{context}

Question: {question}
Helpful answer in markdown:`;

export const makeChain = (vectorstore: PineconeStore) => {
  const model = new OpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
    }
  );
  return chain;
};

export const deckRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.deck.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        descrption: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.deck.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),

  getLearningSet: protectedProcedure
    .input(
      z.object({
        deckId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      return await ctx.prisma.card.findMany({
        take: user?.maxCardsPerSession,
        where: {
          deckId: input.deckId,
          dueDate: {
            lt: new Date(),
          },
        },
      });
    }),

  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.deck.findFirst({
      include: {
        cards: true,
      },
      where: {
        id: input,
      },
    });
  }),

  getAllForUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.deck.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.deck.delete({
        where: {
          id: input,
        },
      });
    }),

  chatWithSlides: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        history: z.array(z.tuple([z.string(), z.string()])),
        deckId: z.string(),
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
          namespace: input.deckId,
        }
      );

      const chain = makeChain(vectorStore);

      const history = input.history.flatMap(([q, a]) =>
        [new HumanChatMessage(q), new AIChatMessage(a)]
      )
      const response = await chain.call({
        question: input.question.trim().replaceAll("\n", ""),
        chat_history: history,
      });

      return response;
    }),
});
