export const isDueCheck = (sentence, todayDateObj) => {
  return (
    (sentence?.nextReview && sentence.nextReview < todayDateObj) ||
    new Date(sentence?.reviewData?.due) < todayDateObj
  );
};
