import { OpenAI } from "langchain";
import { env } from "~/env.mjs";

export const model = new OpenAI(
  {
    temperature: 0,
    modelName: env.USE_GPT4 ? "gpt-4" : "gpt-3.5-turbo",
  },
  { organization: env.OPENAI_ORGANIZATION }
);
