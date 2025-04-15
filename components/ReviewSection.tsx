import React, {View} from 'react-native';
import {useState} from 'react';
import FutureDateIncrementor from './FutureDateIncrementor';
import {isSameDay} from '../utils/check-same-date';
import {
  ActivityIndicator,
  Button,
  DefaultTheme,
  FAB,
  Text,
} from 'react-native-paper';
import {SettingBlock} from './DisplaySettings';
import AreYouSurePrompt from './AreYouSurePrompt';

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
  handleIsCore,
  isCore,
  handleBreakdownAllSentences,
  isLoadingReviewSectionState,
}) => {
  const [futureDaysState, setFutureDaysState] = useState(3);
  const [areYouSureState, setAreYouSureState] = useState(false);
  const [areYouSureBreakdownState, setAreYouSureBreakdownState] =
    useState(false);

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
    setAreYouSureState(!areYouSureState);
  };
  const handleBulkBreakdownFunc = () => {
    setAreYouSureBreakdownState(!areYouSureBreakdownState);
  };

  const handleAreYouSureBulkBreakdown = async () => {
    await handleBreakdownAllSentences();
    setAreYouSureBreakdownState(false);
  };
  const handleAreYouSureBulk = async () => {
    await handleBulkReviews({removeReview: hasSomeReviewedSentences});
    setAreYouSureState(false);
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
        opacity: isLoadingReviewSectionState ? 0.5 : 1,
      }}>
      {isLoadingReviewSectionState && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: '50%',
            zIndex: 100,
          }}
        />
      )}
      <SettingBlock func={handleIsCore} bool={isCore} text={'Core'} />
      <FAB
        onPress={handleBulkReviewsFunc}
        variant={hasSomeReviewedSentences ? 'tertiary' : 'primary'}
        icon="clock"
        label={
          hasSomeReviewedSentences ? ' Remove all reviews' : 'Bulk add reviews'
        }
      />
      {areYouSureState && (
        <AreYouSurePrompt
          yesText="Yes"
          yesOnPress={handleAreYouSureBulk}
          noText="No"
          noOnPress={() => setAreYouSureState(false)}
        />
      )}
      <FAB
        onPress={handleBulkBreakdownFunc}
        variant={'tertiary'}
        icon="hammer"
        label={'Bulk breakdown'}
      />
      {areYouSureBreakdownState && (
        <AreYouSurePrompt
          yesText="Yes"
          yesOnPress={handleAreYouSureBulkBreakdown}
          noText="No"
          noOnPress={() => setAreYouSureBreakdownState(false)}
        />
      )}
      <View>
        <Text style={DefaultTheme.fonts.bodyMedium}>{nextReviewText}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}>
        <Button
          onPress={setNextReviewDate}
          mode="outlined"
          style={{
            alignContent: 'center',
            alignSelf: 'center',
          }}>
          {futureStateText}
        </Button>
        <FutureDateIncrementor
          futureDaysState={futureDaysState}
          setFutureDaysState={setFutureDaysState}
        />
      </View>
    </View>
  );
};

export default ReviewSection;
