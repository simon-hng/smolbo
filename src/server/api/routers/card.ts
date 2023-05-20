import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
});
