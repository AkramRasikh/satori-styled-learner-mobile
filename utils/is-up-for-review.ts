import {isSameDay} from './check-same-date';

export const isUpForReview = ({nextReview, todayDate}) => {
  if (!nextReview) return false;

  const thisNextReviewObj = new Date(nextReview);

  if (isSameDay(todayDate, thisNextReviewObj)) {
    return true;
  }

  const differenceInMilliseconds = todayDate - thisNextReviewObj;

  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays < 0) {
    return false;
  }
  return true;
};

export const checkIsFutureReviewNeeded = ({nextReview, todayDate}) => {
  if (!nextReview) return false;

  const thisNextReviewObj = new Date(nextReview);

  if (isSameDay(todayDate, thisNextReviewObj)) {
    return false;
  }

  const differenceInMilliseconds = todayDate - thisNextReviewObj;

  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays >= 0) {
    return false;
  }
  return true;
};
