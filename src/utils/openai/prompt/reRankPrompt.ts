export const reRankPrompt = (query: string, results: string[]) => {
  return `
    
You are an intelligent search engine assistant. Given the search query below, rank the provided documents based on their relevance.

Query: "${query}"
Documents:
${results.map((doc, index) => `${index + 1}. ${doc}`).join('\n')}
Return the documents in a sorted JSON array from most relevant to least relevant(with proper alignment humen readable format).
        `;
};
