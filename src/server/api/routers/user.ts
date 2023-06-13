import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),

  updateUser: protectedProcedure
    .input(
      z.object({
        maxCardsPerSession: z.number().int(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: input,
      });
    }),
});
