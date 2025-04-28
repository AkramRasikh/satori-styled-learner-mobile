import {getNextScheduledOptions} from '.';
import {getEmptyCard} from '../../srs-algo';
import {getTimeDiffSRS} from '../getTimeDiffSRS';

const sentenceHelperUpperLimit = 30;

export const srsCalculationAndText = ({reviewData, contentType, timeNow}) => {
  const hasDueDate = reviewData?.due ? new Date(reviewData?.due) : null; // check if due yet

  const cardDataRelativeToNow = hasDueDate ? reviewData : getEmptyCard();

  const nextScheduledOptions = getNextScheduledOptions({
    card: cardDataRelativeToNow,
    contentType, // srsRetentionKeyTypes.vocab
  });
  const againDue = nextScheduledOptions['1'].card.due;
  const hardDue = nextScheduledOptions['2'].card.due;
  const goodDue = nextScheduledOptions['3'].card.due;
  const easyDue = nextScheduledOptions['4'].card.due;

  const date1 = new Date(timeNow);
  const date2 = new Date(easyDue);
  const diffMs = date1 - date2;

  // Convert to seconds, minutes, hours, days
  const diffSeconds = diffMs / 1000;
  const diffMinutes = diffSeconds / 60;
  const diffHours = diffMinutes / 60;
  const diffDays = diffHours / 24;

  const isScheduledForDeletion = Math.abs(diffDays) > sentenceHelperUpperLimit;

  const againText = getTimeDiffSRS({dueTimeStamp: againDue, timeNow}) as string;
  const hardText = getTimeDiffSRS({dueTimeStamp: hardDue, timeNow}) as string;
  const goodText = getTimeDiffSRS({dueTimeStamp: goodDue, timeNow}) as string;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;

  return {
    againText,
    hardText,
    goodText,
    easyText,
    nextScheduledOptions,
    isScheduledForDeletion,
  };
};
