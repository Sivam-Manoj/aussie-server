import { client } from './chromaClient.js';

// ✅ Define the collection
export const createCollection = async () => {
  try {
    const collection = await client.getOrCreateCollection({ name: 'Players' });
    console.log("✅ Collection 'Fitness' is ready.");
    return collection;
  } catch (error) {
    console.error('❌ Error creating collection:', error);
    throw error;
  }
};
