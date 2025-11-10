import { SYSTEM_PROMPT } from "@/constants/system-prompts";
import { searchDocument } from "@/lib/searching";
import { google } from "@ai-sdk/google";
import { UIMessage } from "@ai-sdk/react";
import {
  InferUITools,
  UIDataTypes,
  convertToModelMessages,
  stepCountIs,
  streamText,
} from "ai";
import { z } from "zod";

const tools = {
  searchDocument: {
    description: "Search the uploaded documents for relevant information",
    inputSchema: z.object({
      query: z.string().describe("The query to find relevant docs"),
    }),
    execute: async ({ query }: { query: string }) => {
      try {
        const { rows: docs, rowCount } = await searchDocument(query);
        console.log("rowCount", rowCount);

        if (!rowCount) return "No relevant docs found";
        const formatedResults = docs
          .map((doc, i) => `[${i + 1}] ${doc.content}`)
          .join("\n\n");
        return formatedResults;
      } catch (error) {
        console.error(error);
        return "error Searching in the documents";
      }
    },
  },
};
export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const res = streamText({
      model: google("gemini-2.0-flash"),
      messages: convertToModelMessages(messages),
      tools,
      system: SYSTEM_PROMPT,
      stopWhen: stepCountIs(2),
    });

    return res.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
