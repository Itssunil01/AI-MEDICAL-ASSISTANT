export const expandQuery = (disease, query) => {
  return `${query} AND ${disease}`;
};