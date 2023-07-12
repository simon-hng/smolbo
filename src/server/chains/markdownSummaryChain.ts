import { LLMChain, PromptTemplate } from "langchain";
import { model } from "./model";

export const makeMarkdownSummaryChain = () => {
  const promptTemplate = new PromptTemplate({
    template: `
      You are a feature that generates markdown summaries from lecture slides.
      You are given an array of strings, where each string is the content of one slide
      The begginning of each slide is marked by the keyword BEGINNING_SLIDE followed by the slide number.
      For each slide generate a summary of that slide in markdown with correct formatting and highlighting of important terms.
      [{content}]
      `,
    inputVariables: ["content"],
  });

  //   const pdfContent = files
  //     .map((file) => {
  //       const metadata = file.metadata as { loc?: { pageNumber?: number } };
  //       const pageNumber = metadata?.loc?.pageNumber;
  //       return `BEGINNING_SLIDE ${pageNumber ?? ""}\n` + file.pageContent;
  //     })
  //     .join("\n");

  return new LLMChain({ llm: model, prompt: promptTemplate });
};
