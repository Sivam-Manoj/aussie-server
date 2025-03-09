import { enhanceQuery } from '../openai/enhanceQuery.js';
import { generateEmbeddings } from '../openai/generateEmbeddings.js';
import { createCollection } from './createChromaCollection.js';
import { rerankResults } from '../openai/rerankResults.js';

export const searchIndex = async (queryText: string) => {
  try {
    const enhancedQuery = await enhanceQuery(queryText);
    const queryVector = await generateEmbeddings(enhancedQuery);

    const collection = await createCollection();
    const results = await collection.query({
      queryEmbeddings: [queryVector],
      nResults: 5, // Retrieve more results before reranking
    });

    // Ensure results.documents exists and is a flat array of strings
    const documents: string[] =
      results.documents?.flat().filter((doc) => typeof doc === 'string') || [];

    if (documents.length === 0) return [];

    // 🔹 Rerank using GPT-4
    const rerankedResults = await rerankResults(enhancedQuery, documents);

    return rerankedResults;
  } catch (error) {
    console.error('❌ Error searching ChromaDB:', error);
    return [];
  }
};
