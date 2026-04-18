import axios from "axios";

export const fetchPubMed = async (query) => {
  const res = await axios.get(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`,
    {
      params: {
        db: "pubmed",
        term: query,
        retmax: 20,
        retmode: "json"
      }
    }
  );

  return res.data;
};

