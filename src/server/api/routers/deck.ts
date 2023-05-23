import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const deckRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.deck.create({
        data: input,
      });

      return input;
    }),

  update: publicProcedure
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

      return input;
    }),

  getLearningSet: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    // TODO add a more sophisticated way to get valid cards to learn
    return ctx.prisma.card.findMany({
      where: {
        deckId: input,
      },
    });
  }),

  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.deck.findFirst({
      include: {
        cards: true,
      },
      where: {
        id: input,
      },
    });
  }),

  getAllForUser: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.deck.findMany({
      where: {
        userId: input,
      },
    });
  }),

  deleteById: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.deck.delete({
        where: {
          id: input,
        },
      });
    }),
});
