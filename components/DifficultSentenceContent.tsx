import {Text, View} from 'react-native';

import {isSameDay} from '../utils/check-same-date';

const DifficultSentenceContent = ({
  topic,
  isCore,
  targetLang,
  baseLang,
  nextReview,
  todayDateObj,
}) => {
  const thisNextReviewObj = new Date(nextReview);

  const getAdjustedDifferenceInDays = (dateA, dateB) => {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
    const differenceInTime = dateB - dateA; // Difference in milliseconds
    const differenceInDays = Math.floor(
      differenceInTime / oneDayInMilliseconds,
    );

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
  const calculateDueDate = () => {
    if (isSameDay(todayDateObj, thisNextReviewObj)) {
      return `Due today`;
    }

    const daysDifference = getAdjustedDifferenceInDays(
      todayDateObj,
      thisNextReviewObj,
    );

    if (daysDifference < 0) {
      return `Due ${Math.abs(daysDifference)} days ago`;
    }

    return `Due in ${daysDifference} days`;
  };

  const dueText = calculateDueDate();
  return (
    <>
      <Text
        style={{
          fontStyle: 'italic',
          textDecorationLine: 'underline',
        }}>
        {topic} {isCore ? '🧠' : ''}
      </Text>
      <View>
        <Text>{targetLang}</Text>
      </View>
      <View>
        <Text>{baseLang}</Text>
      </View>
      <View>
        <Text>{dueText}</Text>
      </View>
    </>
  );
};

export default DifficultSentenceContent;
