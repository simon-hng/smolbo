import { OpenAI } from "langchain";
import { env } from "~/env.mjs";

export const model = new OpenAI(
  {
    temperature: 0,
    modelName: env.OPENAI_MODELNAME,
  },
  { organization: env.OPENAI_ORGANIZATION }
);
