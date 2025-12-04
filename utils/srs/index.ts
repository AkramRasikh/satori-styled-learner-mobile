import {createEmptyCard, generatorParameters, fsrs} from 'ts-fsrs';
import {getEmptyCard} from '../../srs-algo';

// grade = [1,2,3,4]
export const srsRetentionKey = {
  vocab: 0.98,
  sentences: 0.97,
  topic: 0.95,
  media: 0.93,
  snippet: 0.93,
};
export const srsRetentionKeyTypes = {
  vocab: 'vocab',
  sentences: 'sentences',
  topic: 'topic',
  media: 'media',
  snippet: 'snippet',
};

const initFsrs = ({contentType}) => {
  const retentionKey = srsRetentionKey[contentType];
  const params = generatorParameters({
    maximum_interval: 1000,
    request_retention: retentionKey,
  });
  return fsrs(params);
};

export const getNextScheduledOptions = ({card, contentType}) => {
  const f = initFsrs({contentType});
  return f.repeat(card, new Date());
};

export const initCardWithPreviousDateInfo = ({
  lastReviewDate,
  dueDate,
  reps,
}) => {
  const card = createEmptyCard() as any;
  card.due = new Date(dueDate);
  card.ease = 2.5; // Default ease factor for a new card
  card.interval = 0; // Initial interval for a new card
  card.reps = reps || 0;
  card.last_review = new Date(lastReviewDate); // Set the last review date to now
  return card;
};

export const getDueDate = reviewData => {
  if (reviewData?.due) {
    return new Date(reviewData?.due);
  }
  return null;
};

export const getCardDataRelativeToNow = ({
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
