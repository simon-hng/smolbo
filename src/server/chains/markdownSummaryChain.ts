import { LLMChain, PromptTemplate } from "langchain";
import { model } from "./model";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

export const makeMarkdownSummaryChain = () => {
  const parser = StructuredOutputParser.fromZodSchema(z.array(z.string()));
  const formatInstructions = parser.getFormatInstructions();
  const promptTemplate = new PromptTemplate({
    template: `
      You are a feature for a flashcard app.
      You are given a list of slides in unstructured text.
      The begginning of each slide is marked by the keyword BEGINNING_SLIDE.
      For each slide generate a question about the content of that slide, 
      whose answer summarizes the content of that slide.
      Ask questions that can be answered without any additional context.
      If there is not enough content in the slides for a good question return nothing.
      Only return a flat array of strings with the questions. 
      DO NOT RETURN ANY ANSWERS

      {content}
      `,
    inputVariables: ["content"],
    partialVariables: { format_instructions: formatInstructions },
  });

  return new LLMChain({ llm: model, prompt: promptTemplate });
};
