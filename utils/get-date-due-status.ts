import {isSameDay} from './check-same-date';

const getAdjustedDifferenceInDays = (dateA, dateB) => {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
  const differenceInTime = dateB - dateA; // Difference in milliseconds
  const differenceInDays = Math.floor(differenceInTime / oneDayInMilliseconds);

  // Check if the dates are on different calendar days
  const isDifferentCalendarDay =
    dateA.getDate() !== dateB.getDate() ||
    dateA.getMonth() !== dateB.getMonth() ||
    dateA.getFullYear() !== dateB.getFullYear();

  // If dates are on different calendar days, acknowledge it as a full day difference
  if (isDifferentCalendarDay) {
    return differenceInDays + 1;
  }

  return differenceInDays;
};

export const calculateDueDate = ({todayDateObj, nextReview}) => {
  const thisNextReviewObj = new Date(nextReview);

  if (isSameDay(todayDateObj, thisNextReviewObj)) {
    return 0;
  }

  const daysDifference = getAdjustedDifferenceInDays(
    todayDateObj,
    thisNextReviewObj,
  );

  if (daysDifference < 0) {
    return daysDifference;
  }

  return daysDifference;
};

export const getDueDateText = dueStatus => {
  if (dueStatus === 0) {
    return {
      dueColorState: '#FFBF00',
      text: `Due today`,
    };
  }

  if (dueStatus < 0) {
    return {
      dueColorState: '#8B0000',
      text: `Due ${Math.abs(dueStatus)} days ago`,
    };
  }

  return {
    dueColorState: 'green',
    text: `Due in ${dueStatus} days`,
  };
};
