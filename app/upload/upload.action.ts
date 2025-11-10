"use server";

import { chunkText } from "@/lib/chunking";
import { generateEmbeddingsMany } from "@/lib/embedding";
import { PDFParse } from "pdf-parse";
import pgvector from "pgvector/pg";
import { getDBClient } from "@/lib/db-config";

type Result =
  | {
      success: true;
      data: string;
    }
  | {
      success: false;
      error: string;
    };

function cleanTextForPostgres(text: string): string {
  return text
    .replace(/\x00/g, "") // Remove null bytes
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "") // Remove control chars
    .replace(/\uFFFD/g, "") // Remove replacement character
    .replace(/\s+/g, " ") // Normalize whitespace
    .normalize("NFC") // Normalize unicode
    .trim();
}
export const uploadFile = async (formData: FormData): Promise<Result> => {
  try {
    const file = formData.get("file") as File;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const data = new PDFParse({ data: buffer });
    const { text } = await data.getText();
    if (!text || text.length === 0) {
      return {
        success: false,
        error: "No Text found in the pdf",
      };
    }

    const chunks = await chunkText(text.trim());
    const embeddings = await generateEmbeddingsMany(chunks);
    const client = await getDBClient();
    const fileData = {
      name: file.name,
      type: file.type,
    };
    const { rows } = await client.query(
      `INSERT INTO files (filename, file_type)
       VALUES ($1, $2)
       RETURNING id`,
      [fileData.name, fileData.type],
    );
    const fileId = rows[0]?.id;
    if (!fileId) return { success: false, error: "Failed to upload document" };
    for (let i = 0; i < chunks.length; i++) {
      const cleanedContent = cleanTextForPostgres(chunks[i]);
      if (!cleanedContent) continue;
      await client.query(
        `INSERT INTO documents (id,file_id, content, embedding)
         VALUES (
           gen_random_uuid(),
           $1,
           $2,
           $3
         )
         RETURNING *`,
        [fileId, cleanedContent, pgvector.toSql(embeddings[i])],
      );
    }

    return {
      success: true,
      data: text,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to upload file" };
  }
};
