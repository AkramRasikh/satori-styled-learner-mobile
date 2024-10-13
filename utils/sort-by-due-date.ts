export const sortByDueDate = (a, b) => {
  const aDate = a?.reviewData?.due;
  const bDate = b?.reviewData?.due;

  const aDateLegacy = a.nextReview;
  const bDateLegacy = b.nextReview;
  if ((aDate || aDateLegacy) < (bDate || bDateLegacy)) {
    return -1;
  }
  if ((aDate || aDateLegacy) > (bDate || bDateLegacy)) {
    return 1;
  }
  return 0;
};
