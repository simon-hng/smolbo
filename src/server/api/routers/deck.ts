import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

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
    }),

  getLearningSet: protectedProcedure
    .input(
      z.object({
        deckId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.card.findMany({
        where: {
          deckId: input.deckId,
          cardStats: {
            some: {
              dueDate: {
                lt: new Date(),
              },
              userId: ctx.session.user.id,
            },
          },
        },
        include: {
          cardStats: {
            where: {
              userId: ctx.session.user.id,
            },
          },
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

  getAllForUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.deck.findMany({
      where: {
        userId: ctx.session.user.id,
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
