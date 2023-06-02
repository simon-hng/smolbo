import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

  deleteById: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.card.delete({
        where: {
          id: input,
        },
      });
    }),

  getBackRecommendation: publicProcedure
    .input(
      z.object({
        deckId: z.string(),
        front: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const deck = await ctx.prisma.deck.findFirst({
        where: {
          id: input.deckId,
        },
      });

      if (!deck) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The deck you provided does not exist",
        });
      }

      const result = await openai
        .createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a flashcard app that responds in Markdown. 
                Use mathematical equations and set theory in latex.
                Utilize LaTeX in Markdown for equations, with inline LaTeX enclosed in \`$\` and LaTeX blocks enclosed in \`$$\`.`,
            },
            {
              role: "system",
              content: `You are writing a flashcard for ${deck.title}`,
            },
            { role: "user", content: input.front },
          ],
        })
        .then((res) => res.data)
        .catch((e) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get OpenAI response",
            cause: e,
          });
        });

      return result.choices;
    }),
});
