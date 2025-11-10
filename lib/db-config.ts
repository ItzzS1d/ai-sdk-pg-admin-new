import { Client } from "pg";
import pgvector from "pgvector/pg";

const globalForPG = global as unknown as {
  client?: Client;
  isConnected?: boolean;
};

if (!globalForPG.client) {
  globalForPG.client = new Client({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    database: process.env.PGDATABASE || "mydb",
    password: process.env.PGPASSWORD || "postgres",
    port: parseInt(process.env.PGPORT || "5433", 10),
  });
  globalForPG.isConnected = false;
}

export async function getDBClient() {
  const client = globalForPG.client!;

  if (!globalForPG.isConnected) {
    await client.connect();
    await pgvector.registerType(client);
    globalForPG.isConnected = true;
  }

  return client;
}
