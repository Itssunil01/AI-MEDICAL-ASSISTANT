import { expandQuery } from "../utils/queryExpansion.js";
import { fetchOpenAlex } from "../services/openAlexService.js";
import { fetchTrials } from "../services/clinicalTrialsService.js";
import { generateResponse } from "../services/llmService.js";

export const handleQuery = async (req, res) => {
  try {
    const { disease, query } = req.body;

    // 1. Expand query
    const expanded = expandQuery(disease, query);

    // 2. Fetch data
    const [papers, trials] = await Promise.all([
      fetchOpenAlex(expanded),
      fetchTrials(disease),
    ]);

    // 3. Limit data
    const topPapers = papers.slice(0, 5).map(p => ({
      title: p.title,
      year: p.publication_year,
    }));

    const topTrials = trials.studies?.slice(0, 5).map(t => ({
      title: t.protocolSection?.identificationModule?.briefTitle,
    })) || [];

    //  4. GENERATE AI RESPONSE (YOU MISSED THIS)
    const aiResponse = await generateResponse({
      query,
      disease,
      papers: topPapers,
      trials: topTrials,
    });

    // 5. Send response
    res.json({
      success: true,
      aiResponse,
      papers: topPapers,
      trials: topTrials,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};