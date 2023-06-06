import type { NextApiRequest, NextApiResponse } from "next";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/db";

module.exports = (_req: NextApiRequest, res: NextApiResponse) => {
  prisma.card
    .updateMany({
      data: {
        interval: {
          decrement: 1,
        },
      },
      where: {
        interval: {
          gt: 1,
        },
      },
    })
    .catch((err) => {
      throw new TRPCError({
        message: "failed to decrease interval",
        code: "INTERNAL_SERVER_ERROR",
        cause: err,
      });
    });

  res.status(200).json({
    message: "Updated all card intervals",
  });
};
