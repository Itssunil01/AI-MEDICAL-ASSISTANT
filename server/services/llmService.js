import axios from "axios";

export const generateResponse = async ({ query, disease, papers, trials }) => {
 const prompt = `
You are a medical research assistant.

Use the given data to answer the query.

Write:
- A short overview (3-4 lines)
- 3 key insights (bullet points)
- 2 clinical trials (bullet points)

DO NOT include headings like Overview, Insights, etc.
Just write clean text.

Query: ${query}
Disease: ${disease}

Papers:
${papers.map(p => p.title).join("\n")}

Trials:
${trials.map(t => t.title).join("\n")}
`;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "tinyllama",
    prompt,
    stream: false,
  });

  return res.data.response;
};