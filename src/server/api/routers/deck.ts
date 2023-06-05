import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
        amount: z.number().int(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.card.findMany({
        take: input.amount,
        orderBy: {
          interval: "asc",
        },
        where: {
          deckId: input.deckId,
        },
      });
    }),

  updateLearningSet: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          front: z.string(),
          back: z.string(),
          interval: z.number(),
          repetitions: z.number(),
        })
      )
    )
    .mutation(({ ctx, input }) => {
      input.forEach((card) => {
        ctx.prisma.card
          .update({
            where: { id: card.id },
            data: card,
          })
          .catch((error) => {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `Failed to update card ${card.id}`,
              cause: error,
            });
          });
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
