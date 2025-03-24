export const reRankPrompt = (query: string, results: string) => {
  return `
    
You are an intelligent football coach and ai analyzer regarding their data. Given the search query below,  provide answer based on their questions.(only speak relevent things and avoid hallucinations like out topic)

Query: "${query}"
Documents: ${results}
Return the answer based on the query.
        `;
};
