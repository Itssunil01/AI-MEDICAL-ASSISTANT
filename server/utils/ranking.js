export const rankResults = (data) => {
  return data.sort((a, b) => b.year - a.year); // recent first
};