import { ChromaClient } from 'chromadb';

// ✅ Connect to ChromaDB running in Docker
export const client = new ChromaClient({
  path: 'http://localhost:8000', // Ensure Chroma is running in Docker on this port
});
