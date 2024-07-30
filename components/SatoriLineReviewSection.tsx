import {Text, TouchableOpacity, View} from 'react-native';
import FutureDateIncrementor from './FutureDateIncrementor';

const nextReviewCalculation = nextReview => {
  const differenceInMilliseconds = new Date(nextReview) - new Date();

  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays === 0) {
    return `Due in ${Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60),
    )} hours`;
  }

  return `Due in +${differenceInDays} days`;
};

const SatoriLineReviewSection = ({
  nextReview,
  futureDaysState,
  setFutureDaysState,
  setNextReviewDate,
}) => {
  const nextReviewText = nextReview
    ? nextReviewCalculation(nextReview)
    : 'Not reviewed';

  const reviewText =
    nextReview && futureDaysState === 0
      ? 'No need'
      : `+ ${futureDaysState} days`;
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 5,
        justifyContent: 'space-between',
        width: '100%',
      }}>
      <View style={{alignSelf: 'center'}}>
        <Text>{nextReviewText}</Text>
      </View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 5}}>
        <FutureDateIncrementor
          futureDaysState={futureDaysState}
          setFutureDaysState={setFutureDaysState}
        />
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: '#6082B6',
            padding: 5,
            borderRadius: 10,
          }}>
          <TouchableOpacity onPress={setNextReviewDate}>
            <Text>{reviewText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SatoriLineReviewSection;
