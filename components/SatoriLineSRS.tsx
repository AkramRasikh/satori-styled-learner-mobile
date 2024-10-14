import {Button, Text, TouchableOpacity, View} from 'react-native';
import {
  getEmptyCard,
  getNextScheduledOptions,
  initCardWithPreviousDateInfo,
  srsRetentionKeyTypes,
} from '../srs-algo';
import {useState} from 'react';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';
import NumberIncrementor from './NumberIncrementor';

const getDueDate = reviewData => {
  if (reviewData?.due) {
    return new Date(reviewData?.due);
  }
  return null;
};
const getCardDataRelativeToNow = ({
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

const SatoriLineSRS = ({
  topicName,
  sentence,
  updateSentenceData,
  setShowReviewSettings,
}) => {
  const [nextReviewDateState, setNextReviewDateState] = useState('');
  const [futureDaysState, setFutureDaysState] = useState(3);
  const timeNow = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reviewData = sentence?.reviewData;

  const hasDueDate = getDueDate(reviewData);

  const nextReview = sentence?.nextReview;
  const reviewHistory = sentence?.reviewHistory;

  const hasLegacyReviewSystem = !reviewData?.due && nextReview;

  const cardDataRelativeToNow = getCardDataRelativeToNow({
    hasDueDate,
    reviewData,
    nextReview,
    reviewHistory,
  });

  const getShouldRemoveLegacyFields = () => {
    if (hasLegacyReviewSystem) {
      return {
        nextReview: null,
        reviewHistory: null,
      };
    }
    return {};
  };

  const nextScheduledOptions = getNextScheduledOptions({
    card: cardDataRelativeToNow,
    contentType: srsRetentionKeyTypes.sentences,
  });

  const handleRemoveSentenceReview = async () => {
    try {
      await updateSentenceData({
        topicName,
        sentenceId: sentence.id,
        fieldToUpdate: {
          reviewData: null,
          ...getShouldRemoveLegacyFields(),
        },
      });
      setShowReviewSettings(false);
    } catch (error) {
      console.log('## handleRemoveSentenceReview', {error});
    }
  };

  const handleSetManualTime = async daysToManualAdd => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToManualAdd);
    const nextReviewData = {
      ...cardDataRelativeToNow,
      due: newDate,
    };
    try {
      await updateSentenceData({
        topicName,
        sentenceId: sentence.id,
        fieldToUpdate: {
          reviewData: nextReviewData,
          ...getShouldRemoveLegacyFields(),
        },
      });
      setNextReviewDateState(newDate.toISOString());
      setShowReviewSettings(false);
    } catch (error) {
      console.log('## handleSetManualTime error', error);
    }
  };

  const handleNextReview = async difficulty => {
    const nextReviewData = nextScheduledOptions[difficulty].card;

    try {
      await updateSentenceData({
        topicName,
        sentenceId: sentence.id,
        fieldToUpdate: {
          reviewData: nextReviewData,
          ...getShouldRemoveLegacyFields(),
        },
      });
      setNextReviewDateState(nextReviewData.due);
    } catch (error) {
      console.log('## handleNextReview', {error});
    }
  };

  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;

  const tomorrowHardCodedTxt = getTimeDiffSRS({
    dueTimeStamp: tomorrow,
    timeNow,
  }) as string;
  const goodDue = nextScheduledOptions['3'].card.due;
  const easyDue = nextScheduledOptions['4'].card.due;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;
  const goodDueText = getTimeDiffSRS({
    dueTimeStamp: goodDue,
    timeNow,
  }) as string;

  const showDeleteBtn = nextReviewDateState || hasDueDateInFuture || nextReview;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      }}>
      {nextReviewDateState ? (
        <View style={{padding: 10}}>
          <Text>
            {getTimeDiffSRS({dueTimeStamp: nextReviewDateState, timeNow})}
          </Text>
        </View>
      ) : hasDueDateInFuture ? (
        <View style={{padding: 10, alignSelf: 'center'}}>
          <Text>
            Due in {getTimeDiffSRS({dueTimeStamp: hasDueDate, timeNow})}
          </Text>
        </View>
      ) : (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
          }}>
          {!nextReviewDateState || !hasDueDateInFuture || !nextReview ? (
            <View>
              <Button
                title={tomorrowHardCodedTxt}
                onPress={() => handleSetManualTime(1)}
              />
            </View>
          ) : (
            <View>
              <Button
                title={goodDueText}
                onPress={() => handleNextReview('3')}
              />
            </View>
          )}
          <View>
            <Button title={easyText} onPress={() => handleNextReview('4')} />
          </View>
          <NumberIncrementor
            futureDaysState={futureDaysState}
            setFutureDaysState={setFutureDaysState}
            handleSetManualTime={handleSetManualTime}
          />
        </View>
      )}
      {showDeleteBtn && (
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            backgroundColor: '#6082B6',
            padding: 5,
            borderRadius: 10,
          }}
          onPress={handleRemoveSentenceReview}>
          <Text>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SatoriLineSRS;
