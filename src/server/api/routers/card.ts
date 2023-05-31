import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { backOff } from "exponential-backoff";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

export const cardRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        front: z.string(),
        back: z.string(),
        deckId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.card.create({
        data: input,
      });

      return input;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        front: z.string(),
        back: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.card.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return input;
    }),

  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.card.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getBackRecommendation: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      console.log(input);

      const model = new OpenAI({ temperature: 0.9 });
      const prompt = new PromptTemplate({
        template: `You are a flashcard app. 
    What is a good answer in markdown to the following question
    {question}`,
        inputVariables: ["question"],
      });

      const chain = new LLMChain({ llm: model, prompt: prompt });

      const result = await backOff(() => chain.call({ question: input }));
      console.log(result);

      return result as unknown as string;
    }),
});
