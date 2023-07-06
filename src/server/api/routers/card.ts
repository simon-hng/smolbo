import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { ensure } from "~/utils/ts-utils";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const cardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        front: z.string(),
        back: z.string(),
        moduleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.card.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        front: z.string(),
        back: z.string(),
        interval: z.number(),
        repetitions: z.number(),
        dueDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.card
        .update({
          where: {
            id: input.id,
          },
          data: input,
        })
        .catch((error) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to update card ${input.id}`,
            cause: error,
          });
        });
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
        moduleId: z.string(),
        front: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const courseModule = await ctx.prisma.module.findFirst({
        where: {
          id: input.moduleId,
        },
      });

      if (!courseModule) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The module you provided does not exist",
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
              content: `You are writing a flashcard for ${courseModule.title}`,
            },
            { role: "user", content: input.front },
          ],
        })
        .then((res) => res.data.choices.at(0)?.message?.content)
        .catch((e) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Failed to get OpenAI response. Maybe the api did some weird shit again",
            cause: e,
          });
        });

      return ensure(result);
    }),
});
