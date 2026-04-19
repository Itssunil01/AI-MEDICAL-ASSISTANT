import axios from "axios";

export const fetchTrials = async (disease) => {
  const res = await axios.get(
    "https://clinicaltrials.gov/api/v2/studies",
    {
      params: {
        "query.cond": disease,
        pageSize: 5,
      },
    }
  );

  return res.data.studies.map(t => ({
    title: t.protocolSection?.identificationModule?.briefTitle,
  }));
};