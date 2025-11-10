
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table with Ollama-compatible 768-dimension vector column
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding VECTOR(768),
  "createdAt" TIMESTAMP DEFAULT NOW()
);
