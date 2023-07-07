import { quotes } from "~/data/quotes";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const quoteRouter = createTRPCRouter({
  getDailyQuote: protectedProcedure.query(() => {
    const index =
      (new Date().getDate() +
        new Date().getMonth() +
        new Date().getFullYear()) %
      (quotes.length + 1);
    return quotes[index];
  }),
});
