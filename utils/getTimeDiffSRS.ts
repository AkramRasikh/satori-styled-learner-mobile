export const getTimeDiffSRS = ({dueTimeStamp, timeNow}) => {
  const timeDifference = dueTimeStamp - timeNow; // Difference in milliseconds
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  if (days) {
    return `${days} days`;
  }

  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  if (hours) {
    return `${hours} hrs`;
  }
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  if (minutes) {
    return `${minutes} mins`;
  }
};
