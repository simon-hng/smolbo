import formidable, { type Fields, type Files, type File } from "formidable";
import { type IncomingMessage } from "http";
import type { NextApiResponse } from "next/types";
import { PDFLoader } from "langchain/document_loaders";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { type Document } from "langchain/document";
import { getPineconeIndex } from "~/server/pinecone";
import { makeMarkdownSummaryChain } from "~/server/chains/markdownSummaryChain";

export const config = {
  api: {
    bodyParser: false,
  },
};

const createEmbeddings = async (
  moduleId: string,
  pages: Document<Record<string, string>>[]
) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunkedData = await textSplitter.splitDocuments(pages);

  const embeddings = new OpenAIEmbeddings();
  const pineconeIndex = await getPineconeIndex();

  await PineconeStore.fromDocuments(chunkedData, embeddings, {
    pineconeIndex,
    namespace: moduleId,
    textKey: "text",
  });
};

// TODO: It would be a lot easier if the PDFs are just in a blob storage
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createMarkdownSummary = async (
  pages: Document<Record<string, string>>[]
) => {
  const pageChunks = pages
    .map((file) => {
      const metadata = file.metadata as { loc?: { pageNumber?: number } };
      const pageNumber = metadata?.loc?.pageNumber;
      return `BEGINNING_SLIDE ${pageNumber ?? ""}\n` + file.pageContent;
    })
    .reduce((chunks, item, index) => {
      const chunkIndex: number = Math.floor(index / 15);
      chunks[chunkIndex] = ([] as string[]).concat(
        chunks[chunkIndex] || ([] as string[]),
        item
      );
      return chunks;
    }, [] as string[][])
    .map((chunk) => chunk.join("\n"));

  const chain = makeMarkdownSummaryChain();
  const pageQuestions = await Promise.allSettled(
    pageChunks.map(async (chunk) => chain.call({ content: chunk }))
  );
  console.log(pageQuestions);
};

export default async function handler(
  req: IncomingMessage,
  res: NextApiResponse
) {
  const form = formidable({});
  const formParse = form.parse(req) as unknown as Promise<[Fields, Files]>;
  const [fields, data] = await formParse;

  const moduleId = fields.moduleId?.at(0);
  if (!moduleId) {
    res
      .status(405)
      .json({ success: "false", message: "No module id provided" });
    return;
  }

  const files = await Promise.all(
    Object.values(data)
      .filter((file): file is File[] => Array.isArray(file))
      .map((files) => files.at(0))
      .filter((file): file is File => file !== undefined)
  );

  const pages = await Promise.all(
    files.map((file) => new PDFLoader(file.filepath).load())
  ).then((files) => files.flat());

  await createEmbeddings(moduleId, pages);

  res.status(200).json({ success: "true" });
}
