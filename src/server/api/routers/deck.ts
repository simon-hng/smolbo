import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
});
