import axios from "axios";

export const fetchTrials = async (disease) => {
  const res = await axios.get(
    `https://clinicaltrials.gov/api/v2/studies`,
    {
      params: {
        "query.cond": disease,
        pageSize: 20,
        format: "json"
      }
    }
  );
  return res.data;
};