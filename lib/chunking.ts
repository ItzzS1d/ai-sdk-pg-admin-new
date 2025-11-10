import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1500,
  chunkOverlap: 200,
  separators: ["\n## ", "\n\n", "\n", ". "],
});

export async function chunkText(text: string) {
  const cleaned = text
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const chunks = await textSplitter.splitText(cleaned);
  return chunks;
}
