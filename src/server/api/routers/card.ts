import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
});
