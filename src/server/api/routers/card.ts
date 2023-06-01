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

  getBackRecommendation: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      console.log(input);
      const result = await openai
        .createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a flashcard app that responds in Markdown. Add mathematical equations in LaTeX if applicable. Utilize LaTeX in Markdown for equations, with inline LaTeX enclosed in \`$\` and LaTeX blocks enclosed in \`$$\`.`,
            },
            { role: "user", content: input },
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
