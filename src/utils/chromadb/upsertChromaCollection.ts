import { generateEmbeddings } from '../openai/generateEmbeddings.js';
import { createCollection } from './createChromaCollection.js';

// ✅ Insert a new vector into the collection
export const upsertEmbedding = async (
  text: string,
  metadata: Record<string, any>,
  id: string
) => {
  try {
    const vector = await generateEmbeddings(text);
    const collection = await createCollection();

    await collection.upsert({
      documents: [text],
      embeddings: [vector], // Manually providing the vector
      ids: [id], // Unique ID (from mongoDb)
      metadatas: [metadata],
    });

    console.log('✅ Vector added to ChromaDB.');
  } catch (error) {
    console.error('❌ Error upserting vector:', error);
  }
};
