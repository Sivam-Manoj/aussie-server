import { createCollection } from './createChromaCollection.js';

// ✅ Delete a vector from ChromaDB using its MongoDB _id
export const deleteEmbeddingById = async (id: string) => {
  try {
    const collection = await createCollection();

    await collection.delete({ ids: [id] }); // Delete by ID

    console.log(`🗑️ Vector with ID: ${id} deleted from ChromaDB.`);
  } catch (error) {
    console.error(`❌ Error deleting vector with ID: ${id}`, error);
  }
};
