import { ChromaClient } from "chromadb";

// ✅ Connect to ChromaDB running in Docker
export const client = new ChromaClient({
  path: process.env.CHROMA_DB_HOST, // Ensure Chroma is running in Docker on this port
});
