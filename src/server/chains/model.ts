import { OpenAI } from "langchain";

export const model = new OpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
});
