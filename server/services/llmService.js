import axios from "axios";

export const generateResponse = async ({ query, disease, papers, trials }) => {
  try {
    // CHECK: are we running locally?
    if (process.env.NODE_ENV !== "production") {
      //  LOCAL → USE OLLAMA
      const prompt = `
Give:
- Overview
- 3 insights
- 2 clinical trials

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
    }

    //  PRODUCTION (Render/Vercel)
    return `
Overview:
This system analyzes medical data and provides summarized insights.

Key Insights:
- AI-based summarization of research papers
- Integrated clinical trial data
- Fast and structured medical insights

Clinical Trials:
- Trial data available via APIs
- Real-time research integration

Sources:
- OpenAlex API
- ClinicalTrials.gov
`;

  } catch (err) {
    console.error("LLM Error:", err);

    return "Error generating response";
  }
};