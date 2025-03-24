import { enhanceQuery } from "../openai/enhanceQuery.js";
import { generateEmbeddings } from "../openai/generateEmbeddings.js";
import { createCollection } from "./createChromaCollection.js";
import { rerankResults } from "../openai/rerankResults.js";

export const searchIndex = async (queryText: string, userId: string) => {
  try {

    const collection = await createCollection();
    const results = await collection.get({ ids: [userId] });

    // Extract the first (and only) document
    const document = results.documents?.[0]; // Ensure i

    // 🔹 Rerank using GPT-4
    const rerankedResults = await rerankResults(queryText, document as string);

    return rerankedResults; //rerankedResults;
  } catch (error) {
    return [];
  }
};
