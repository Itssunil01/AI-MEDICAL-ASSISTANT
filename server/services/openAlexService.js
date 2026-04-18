import axios from "axios";

export const fetchOpenAlex = async (query) => {
  const res = await axios.get(
    `https://api.openalex.org/works?search=${query}&per-page=50`
  );
  return res.data.results;
};