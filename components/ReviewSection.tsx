import {Text, TouchableOpacity, View} from 'react-native';
import {useState} from 'react';
import FutureDateIncrementor from './FutureDateIncrementor';

const getDaysAgo = (today, isoDateString) => {
  const pastDate = new Date(isoDateString);
  const differenceInMilliseconds = today - pastDate;

  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );
  return differenceInDays;
};
const getDaysLater = (today, futureDate) => {
  const differenceInMilliseconds = new Date(futureDate) - today;

  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );
  return differenceInDays;
};

const setFutureReviewDate = (today, daysToAdd) => {
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
}) => {
  const [futureDaysState, setFutureDaysState] = useState(3);

  const today = new Date();

  const hasBeenReviewed = reviewHistory?.length > 0;
  const lastReviewText = hasBeenReviewed
    ? `Last reviewed ${getDaysAgo(
        today,
        reviewHistory[reviewHistory.length - 1],
      )} days ago`
    : 'Not reviewed!';

  const nextReviewText = nextReview
    ? `Review due in ${getDaysLater(today, nextReview)} days.`
    : 'No review due';

  const updateExistingReviewHistory = () => {
    return [...reviewHistory, new Date()];
  };
  const updateReviewHistory = async () => {
    try {
      const fieldToUpdate = {
        reviewHistory: hasBeenReviewed
          ? updateExistingReviewHistory()
          : [new Date()],
      };
      await updateTopicMetaData({
        topicName,
        fieldToUpdate,
      });
    } catch (error) {
      console.log('## error updateReviewHistory', {error});
    }
  };

  const setNextReviewDate = async () => {
    try {
      const fieldToUpdate = {
        nextReview: setFutureReviewDate(today, futureDaysState),
      };

      await updateTopicMetaData({
        topicName,
        fieldToUpdate,
      });
    } catch (error) {
      console.log('## error setNextReviewDate', error);
    }
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
        borderTopWidth: 2,
        borderColor: 'black',
      }}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          padding: 10,
          gap: 10,
        }}>
        <Text
          style={{
            height: '100%',
          }}>
          {lastReviewText}
        </Text>
        <TouchableOpacity
          style={{padding: 10, backgroundColor: 'grey', borderRadius: 10}}
          onPress={updateReviewHistory}>
          <Text>Reviewed</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          padding: 10,
          gap: 10,
          opacity: !hasBeenReviewed ? 0.5 : 1,
        }}>
        <Text>{nextReviewText}</Text>
        <FutureDateIncrementor
          futureDaysState={futureDaysState}
          setFutureDaysState={setFutureDaysState}
        />

        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: 'grey',
            borderRadius: 10,
            marginVertical: 'auto',
          }}
          disabled={!hasBeenReviewed}
          onPress={setNextReviewDate}>
          <Text>Review in {futureDaysState} days</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReviewSection;
