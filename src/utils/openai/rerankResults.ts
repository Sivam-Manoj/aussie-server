import { openai } from "./openAiClient.js";
import { reRankPrompt } from "./prompt/reRankPrompt.js";

export const rerankResults = async (
  query: string,
  results: string
): Promise<any> => {
  try {
    const systemPrompt = reRankPrompt(results); // System-level reranking prompt
    const userPrompt = query; // User's query

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7, // Lower temperature for consistency
      max_tokens: 16000,
    });

    const content = response.choices[0]?.message?.content?.trim();

    if (!content) throw new Error("GPT response is empty.");
    return content;
  } catch (error) {
    return results; // Fallback to original results if reranking fails
  }
};
