import axios from "axios";

export const generateResponse = async () => {
  return `
Overview:
This is a demo overview

Key Insights:
- Insight 1
- Insight 2
- Insight 3

Clinical Trials:
- Trial 1
- Trial 2

Sources:
- Paper 1 (2023)
`;
};

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "tinyllama",
    prompt,
    stream: false,
  });

  return res.data.response;
};