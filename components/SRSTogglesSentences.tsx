import {Button, Text, View} from 'react-native';
import {
  getEmptyCard,
  getNextScheduledOptions,
  initCardWithPreviousDateInfo,
  srsRetentionKeyTypes,
} from '../srs-algo';
import {useState} from 'react';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';

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

const SRSTogglesSentences = ({
  limitedOptionsMode,
  sentence,
  updateSentenceData,
}) => {
  const [nextReviewDateState, setNextReviewDateState] = useState('');
  const timeNow = new Date();

  const reviewData = sentence?.reviewData;
  const isAdhoc = sentence?.isAdhoc;

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
    contentType: srsRetentionKeyTypes.vocab,
  });
  const againDue = nextScheduledOptions['1'].card.due;
  const hardDue = nextScheduledOptions['2'].card.due;
  const goodDue = nextScheduledOptions['3'].card.due;
  const easyDue = nextScheduledOptions['4'].card.due;

  const handleNextReview = async difficulty => {
    const nextReviewData = nextScheduledOptions[difficulty].card;

    try {
      await updateSentenceData({
        isAdhoc,
        topicName: sentence.topic,
        sentenceId: sentence.id,
        fieldToUpdate: {
          reviewData: nextReviewData,
          ...getShouldRemoveLegacyFields(),
        },
      });
      setNextReviewDateState(nextReviewData.due);
      // hasLegacyReviewSystem delete  nextReview reviewHistory;
    } catch (error) {
      console.log('## handleNextReview', {error});
    }
  };

  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;
  const againText = getTimeDiffSRS({dueTimeStamp: againDue, timeNow}) as string;
  const hardText = getTimeDiffSRS({dueTimeStamp: hardDue, timeNow}) as string;
  const goodText = getTimeDiffSRS({dueTimeStamp: goodDue, timeNow}) as string;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {nextReviewDateState ? (
          <Text>
            {getTimeDiffSRS({dueTimeStamp: nextReviewDateState, timeNow})}
          </Text>
        ) : hasDueDateInFuture ? (
          <Text>
            Due in {getTimeDiffSRS({dueTimeStamp: hasDueDate, timeNow})}
          </Text>
        ) : (
          <>
            {!limitedOptionsMode && (
              <>
                <View>
                  <Button
                    title={againText}
                    onPress={() => handleNextReview('1')}
                  />
                </View>
                <View>
                  <Button
                    title={hardText}
                    onPress={() => handleNextReview('2')}
                  />
                </View>
              </>
            )}
            <View>
              <Button title={goodText} onPress={() => handleNextReview('3')} />
            </View>
            <View>
              <Button title={easyText} onPress={() => handleNextReview('4')} />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default SRSTogglesSentences;
