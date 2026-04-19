import axios from "axios";

export const fetchOpenAlex = async (query) => {
  const res = await axios.get(
    `https://api.openalex.org/works?search=${query}&per-page=5`
  );

  return res.data.results.map(p => ({
  title: p.title,
  year: p.publication_year,
  link: p.id.replace("https://openalex.org/", "https://doi.org/")
}));
};