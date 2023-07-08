import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getModuleTheme } from "~/server/chains/getModuleTheme";
import { getPineconeIndex } from "~/server/pinecone";
import { TRPCError } from "@trpc/server";
import { type NamespaceSummary } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

export const moduleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let theme = {
        emoji: "📚",
        color: "blue",
      };

      theme = await getModuleTheme(input.title, input.description).catch(
        (error) => {
          console.error(error);
          return theme;
        }
      );

      return await ctx.prisma.module.create({
        data: {
          ...input,
          emoji: theme.emoji,
          color: theme.color,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.module.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),

  getLearningSet: protectedProcedure
    .input(
      z.object({
        moduleId: z.string(),
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
          moduleId: input.moduleId,
          dueDate: {
            lt: new Date(),
          },
        },
      });
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const pineconeIndex = await getPineconeIndex();
      const namespaces = (await pineconeIndex
        .describeIndexStats({
          describeIndexStatsRequest: {},
        })
        .then((res) => res.namespaces)) as {
        [key: string]: NamespaceSummary;
      };

      return await ctx.prisma.module
        .findFirst({
          include: {
            cards: true,
          },
          where: {
            id: input,
          },
        })
        .then((data) => ({
          ...data,
          vectorCount: namespaces[input]?.vectorCount ?? 0,
        }));
    }),

  getAllForUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.module.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const pineconeIndex = await getPineconeIndex();

      await Promise.allSettled([
        pineconeIndex.delete1({
          deleteAll: true,
          namespace: input,
        }),
        ctx.prisma.module.delete({
          where: {
            id: input,
          },
        }),
      ]).catch((error) => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete module ${input}`,
          cause: error,
        });
      });

      return input;
    }),
});
