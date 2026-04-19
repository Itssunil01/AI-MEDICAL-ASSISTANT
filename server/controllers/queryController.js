import { fetchOpenAlex } from "../services/openAlexService.js";
import { fetchTrials } from "../services/clinicalTrialsService.js";
import { fetchPubMed } from "../services/pubmedService.js";
import { generateResponse } from "../services/llmService.js";

export const handleQuery = async (req, res) => {
  try {
    const { disease, query } = req.body;

    const expanded = `${query} AND ${disease}`;

    const [openAlex, trials, pubmed] = await Promise.all([
      fetchOpenAlex(expanded),
      fetchTrials(disease),
      fetchPubMed(expanded),
    ]);

    const papers = [
      ...openAlex,
      ...pubmed
    ];

    const aiResponse = await generateResponse({
      query,
      disease,
      papers,
      trials,
    });

    res.json({
      aiResponse,
      papers,
      trials,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};