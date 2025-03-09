import { client } from './chromaClient.js';

export const deleteCollection = async (collectionName: string) => {
  try {
    await client.deleteCollection({ name: 'Players' }); // Delete collection by name
    console.log(
      `🗑️ Collection "${collectionName}" deleted from local ChromaDB.`
    );
  } catch (error) {
    console.error(`❌ Error deleting collection "${collectionName}":`, error);
  }
};
