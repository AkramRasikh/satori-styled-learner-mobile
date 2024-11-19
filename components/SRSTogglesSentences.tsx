import {getEmptyCard, initCardWithPreviousDateInfo} from '../srs-algo';

export const getDueDate = reviewData => {
  if (reviewData?.due) {
    return new Date(reviewData?.due);
  }
  return null;
};
export const getCardDataRelativeToNow = ({
  hasDueDate,
  reviewData,
  nextReview,
  reviewHistory,
}) => {
  if (hasDueDate) {
    return reviewData;
  }

  if (nextReview) {
    return initCardWithPreviousDateInfo({
      lastReviewDate: reviewHistory[reviewHistory.length - 1],
      dueDate: nextReview,
      reps: reviewHistory.length,
    });
  }

  return getEmptyCard();
};
