import React, {View} from 'react-native';
import {
  getCardDataRelativeToNow,
  getDueDate,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../srs-algo';
import {getTimeDiffSRS} from '../../utils/getTimeDiffSRS';
import useDifficultSentenceContext from './context/useDifficultSentence';
import SRSTogglesScaled from '../SRSTogglesScaled';

const DifficultSentenceSRSToggles = ({sentence}) => {
  const {handleNextReview} = useDifficultSentenceContext();
  const timeNow = new Date();

  const reviewData = sentence?.reviewData;
  const hasDueDate = getDueDate(reviewData);

  const nextReview = sentence?.nextReview;
  const reviewHistory = sentence?.reviewHistory;

  const cardDataRelativeToNow = getCardDataRelativeToNow({
    hasDueDate,
    reviewData,
    nextReview,
    reviewHistory,
  });

  const nextScheduledOptions = getNextScheduledOptions({
    card: cardDataRelativeToNow,
    contentType: srsRetentionKeyTypes.sentences,
  });
  const againDue = nextScheduledOptions['1'].card.due;
  const hardDue = nextScheduledOptions['2'].card.due;
  const goodDue = nextScheduledOptions['3'].card.due;
  const easyDue = nextScheduledOptions['4'].card.due;

  const againText = getTimeDiffSRS({dueTimeStamp: againDue, timeNow}) as string;
  const hardText = getTimeDiffSRS({dueTimeStamp: hardDue, timeNow}) as string;
  const goodText = getTimeDiffSRS({dueTimeStamp: goodDue, timeNow}) as string;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;

  return (
    <View
      style={{
        alignSelf: 'center',
      }}>
      <SRSTogglesScaled
        handleNextReview={handleNextReview}
        againText={againText}
        hardText={hardText}
        goodText={goodText}
        easyText={easyText}
      />
    </View>
  );
};
export default DifficultSentenceSRSToggles;
