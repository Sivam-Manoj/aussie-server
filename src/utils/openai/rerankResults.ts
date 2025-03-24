import { openai } from "./openAiClient.js";
import { reRankPrompt } from "./prompt/reRankPrompt.js";

export const rerankResults = async (
  query: string,
  results: string
): Promise<any> => {
  try {
    const prompt = reRankPrompt(query, results);
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.3, // Lower temperature for consistency
    });

    const content = response.choices[0]?.message?.content?.trim();

    if (!content) throw new Error("GPT-4 response is empty.");
    return content;
  } catch (error) {
    return results; // Fallback to original results if reranking fails
  }
};
