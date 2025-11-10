import { getDBClient } from "./db-config";
import { generateEmbeddings } from "./embedding";
import pgvector from "pgvector/pg";

// WHERE embedding <-> $1 < 0.9
export async function searchDocument(query: string, limit = 5) {
  const client = await getDBClient();
  const embedded = await generateEmbeddings(query);

  const { rows, rowCount } = await client.query(
    `
       SELECT id, content,
              embedding <-> $1 AS similarity
       FROM documents
       ORDER BY similarity
       LIMIT $2;
       `,
    [pgvector.toSql(embedded), limit],
  );
  return { rows, rowCount };
}
