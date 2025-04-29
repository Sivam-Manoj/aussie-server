
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
    console.log(rerankedResults);
    return rerankedResults; //rerankedResults;
  } catch (error) {
    return [];
  }
};
