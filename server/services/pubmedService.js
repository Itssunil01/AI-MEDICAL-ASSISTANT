import axios from "axios";

export const fetchPubMed = async (query) => {
  try {
    const searchRes = await axios.get(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
      {
        params: {
          db: "pubmed",
          term: query,
          retmode: "json",
          retmax: 5,
        },
      }
    );

    const ids = searchRes.data.esearchresult.idlist;

    if (!ids.length) return [];

    const detailsRes = await axios.get(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi",
      {
        params: {
          db: "pubmed",
          id: ids.join(","),
          retmode: "json",
        },
      }
    );

    const result = detailsRes.data.result;

    return ids.map(id => ({
      title: result[id]?.title,
      year: result[id]?.pubdate,
    }));

  } catch (err) {
    console.error("PubMed error:", err);
    return [];
  }
};