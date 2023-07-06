import { PromptTemplate } from "langchain";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { model } from "./model";

export const getModuleTheme = async (title: string, description: string) => {
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      emoji: z.string(),
      color: z.string(),
    })
  );
  const formatInstructions = parser.getFormatInstructions();
  const prompt = new PromptTemplate({
    template: `You are a feature that assigns emojis and colors to modules.
          {format_instructions}\nEnclose all json values in double quotes.
          Please assign an emoji and color to the following module\n{module}`,
    inputVariables: ["module"],
    partialVariables: { format_instructions: formatInstructions },
  });
  const query = await prompt.format({
    module: `${title}\n${description}`,
  });
  return model
    .call(query)
    .then((data) => JSON.parse(data) as { emoji: string; color: string });
};
