import {Text, TouchableOpacity, View} from 'react-native';
import {getNextScheduledOptions, srsRetentionKeyTypes} from '../srs-algo';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';
import {getCardDataRelativeToNow, getDueDate} from './SRSTogglesSentences';

const SRSTogglesMini = ({sentence, updateSentenceData}) => {
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
        quickRemoval: true,
      });
    } catch (error) {
      console.log('## handleNextReview', {error});
    }
  };

  const againText = getTimeDiffSRS({dueTimeStamp: againDue, timeNow}) as string;
  const hardText = getTimeDiffSRS({dueTimeStamp: hardDue, timeNow}) as string;
  const goodText = getTimeDiffSRS({dueTimeStamp: goodDue, timeNow}) as string;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'flex-start',
      }}>
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          backgroundColor: '#6082B6',
          padding: 5,
          borderRadius: 10,
        }}
        onPress={() => handleNextReview('3')}>
        <Text>{againText}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          backgroundColor: '#6082B6',
          padding: 5,
          borderRadius: 10,
        }}
        onPress={() => handleNextReview('3')}>
        <Text>{hardText}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          backgroundColor: '#6082B6',
          padding: 5,
          borderRadius: 10,
        }}
        onPress={() => handleNextReview('3')}>
        <Text>{goodText}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          backgroundColor: '#6082B6',
          padding: 5,
          borderRadius: 10,
        }}
        onPress={() => handleNextReview('4')}>
        <Text>{easyText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SRSTogglesMini;
