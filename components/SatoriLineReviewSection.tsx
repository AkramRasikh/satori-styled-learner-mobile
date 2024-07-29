import {Text, TouchableOpacity, View} from 'react-native';
import FutureDateIncrementor from './FutureDateIncrementor';

const nextReviewCalculation = nextReview => {
  const differenceInMilliseconds = new Date() - new Date(nextReview);

  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );

  return differenceInDays;
};

const SatoriLineReviewSection = ({
  nextReview,
  futureDaysState,
  setFutureDaysState,
  setNextReviewDate,
  updateReviewHistory,
}) => {
  const nextReviewText = nextReview
    ? `Due in ${nextReviewCalculation(nextReview)} days`
    : 'Not reviewed';
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 5,
        justifyContent: 'space-around',
        width: '100%',
      }}>
      <View style={{alignSelf: 'center'}}>
        <Text>{nextReviewText}</Text>
        <TouchableOpacity
          onPress={updateReviewHistory}
          style={{
            marginTop: 3,
            backgroundColor: '#6082B6',
            padding: 5,
            borderRadius: 10,
            margin: 'auto',
          }}>
          <Text>Reviewed</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10}}>
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
            <Text>Review in {futureDaysState} days</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SatoriLineReviewSection;
