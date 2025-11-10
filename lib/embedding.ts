import { createOllama, ollama as defaultOllama } from "ollama-ai-provider-v2";
import { embedMany, embed } from "ai";

const ollama =
  process.env.NODE_ENV === "production"
    ? createOllama({
        baseURL: process.env.OLLAMA_HOST || "http://ollama:11434",
      })
    : defaultOllama;

export async function generateEmbeddings(content: string) {
  const input = content.replace("\n", " ");

  // const { embedding } = await embed({
  //   model: google.textEmbeddingModel("text-embedding-004"),
  //   value: input,
  // });

  const { embedding } = await embed({
    model: ollama.embedding("nomic-embed-text"),
    value: input,
  });

  // const response = await fetch("http://localhost:11434/api/embeddings", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     model: "nomic-embed-text",
  //     prompt: input,
  //   }),
  // });
  // const data = await response.json();
  return embedding;
}

export async function generateEmbeddingsMany(texts: string[]) {
  const inputes = texts.map((text) => text.replace("\n", " "));
  const { embeddings } = await embedMany({
    model: ollama.embedding("nomic-embed-text"),
    values: inputes,
  });
  return embeddings;
}
