// import { createOllama, ollama as defaultOllama } from "ollama-ai-provider-v2";
import { embedMany, embed } from "ai";
import { google } from "@ai-sdk/google";

// const ollama =
//   process.env.NODE_ENV === "production"
//     ? createOllama({
//         baseURL: process.env.OLLAMA_HOST || "http://ollama:11434",
//       })
//     : defaultOllama;

export async function generateEmbeddings(content: string) {
  const input = content.replace("\n", " ");

  // const { embedding } = await embed({
  //   model: google.textEmbeddingModel("text-embedding-004"),
  //   value: input,
  // });

  // const { embedding } = await embed({
  //   model: ollama.embedding("nomic-embed-text"),
  //   value: input,
  // });
  const { embedding } = await embed({
    model: google.textEmbedding("text-embedding-004"),
    value: input,
  });
  return embedding;
}

export async function generateEmbeddingsMany(texts: string[]) {
  const inputes = texts.map((text) => text.replace("\n", " "));
  // const { embeddings } = await embedMany({
  //   model: ollama.embedding("nomic-embed-text"),
  //   values: inputes,
  // });
  const { embeddings } = await embedMany({
    model: google.textEmbedding("text-embedding-004"),
    values: inputes,
  });
  return embeddings;
}
