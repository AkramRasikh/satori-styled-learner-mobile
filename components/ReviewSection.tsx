import {Text, TouchableOpacity, View} from 'react-native';
import {useState} from 'react';
import FutureDateIncrementor from './FutureDateIncrementor';
import {isSameDay} from '../utils/check-same-date';

const getDaysLater = (today, futureDate) => {
  const futureDateObj = new Date(futureDate);
  const differenceInMilliseconds = futureDateObj - today;

  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );
  if (differenceInDays === 0) {
    return `Due in ${Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60),
    )} hours`;
  }

  if (isSameDay(today, futureDateObj)) {
    return 'Due today';
  }

  if (differenceInDays < -1) {
    return `Due ${differenceInDays} days ago`;
  }

  return `Due in +${differenceInDays} days`;
};

export const setFutureReviewDate = (today, daysToAdd) => {
  const futureDateWithDays = new Date(
    today.setDate(today.getDate() + daysToAdd),
  );

  return futureDateWithDays;
};

const ReviewSection = ({
  reviewHistory,
  nextReview,
  topicName,
  updateTopicMetaData,
  handleBulkReviews,
  hasSomeReviewedSentences,
}) => {
  const [futureDaysState, setFutureDaysState] = useState(3);

  const today = new Date();

  const hasBeenReviewed = reviewHistory?.length > 0;

  const nextReviewText = nextReview
    ? getDaysLater(today, nextReview)
    : 'No review due';

  const futureStateText =
    futureDaysState === 0 ? 'No need' : `+${futureDaysState} days`;

  const updateExistingReviewHistory = () => {
    return [...reviewHistory, new Date()];
  };

  const handleBulkReviewsFunc = () => {
    handleBulkReviews({removeReview: hasSomeReviewedSentences});
  };

  const setNextReviewDate = () => {
    const reviewNotNeeded = futureDaysState === 0;

    if (reviewNotNeeded) {
      updateTopicMetaData({
        topicName,
        fieldToUpdate: {
          reviewHistory: [],
          nextReview: null,
        },
      });
    } else {
      const fieldToUpdate = {
        reviewHistory: hasBeenReviewed
          ? updateExistingReviewHistory()
          : [new Date()],
        nextReview: setFutureReviewDate(today, futureDaysState),
      };

      updateTopicMetaData({
        topicName,
        fieldToUpdate,
      });
    }
  };

  return (
    <View
      style={{
        gap: 10,
        paddingTop: 10,
        paddingLeft: 10,
        paddingBottom: 10,
        width: '100%',
      }}>
      <TouchableOpacity
        onPress={handleBulkReviewsFunc}
        style={{
          padding: 10,
          backgroundColor: '#FFC5CB',
          borderRadius: 10,
          marginVertical: 'auto',
          alignSelf: 'center',
        }}>
        <Text>
          🕰️{' '}
          {hasSomeReviewedSentences ? 'Remove all reviews' : 'Bulk add reviews'}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text>{nextReviewText}</Text>
      </View>
      <View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: 'grey',
              borderRadius: 10,
              marginVertical: 'auto',
            }}
            onPress={setNextReviewDate}>
            <Text>{futureStateText}</Text>
          </TouchableOpacity>
          <FutureDateIncrementor
            futureDaysState={futureDaysState}
            setFutureDaysState={setFutureDaysState}
          />
        </View>
      </View>
    </View>
  );
};

export default ReviewSection;
