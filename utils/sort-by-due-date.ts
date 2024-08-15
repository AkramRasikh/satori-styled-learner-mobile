export const sortByDueDate = (a, b) => {
  const aDate = a.nextReview;
  const bDate = b.nextReview;
  if (aDate < bDate) {
    return -1;
  }
  if (aDate > bDate) {
    return 1;
  }
  return 0;
};
