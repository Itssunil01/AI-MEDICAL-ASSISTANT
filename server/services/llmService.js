import OpenAI from "openai";

console.log("API KEY:", process.env.GROQ_API_KEY);

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});



export const generateResponse = async ({ query, disease, papers, trials }) => {
  try {
   const prompt = `
You are a medical AI assistant.

STRICTLY follow this format:

About Disease:
Explain the disease in 3-4 lines.

Causes:
- Cause 1
- Cause 2
- Cause 3

Prevention:
- Prevention 1
- Prevention 2
- Prevention 3

IMPORTANT:
- Always include ALL sections
- Never skip Causes or Prevention
- If unsure, give general medical causes/prevention

Disease/Query: ${query}
`;
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful medical AI assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;

  } catch (err) {
    console.error("Groq error:", err);
    return "Error generating response";
  }

  console.log("QUERY:", query);
console.log("DISEASE:", disease);
};
