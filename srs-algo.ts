import {createEmptyCard, generatorParameters, fsrs} from 'ts-fsrs';

// grade = [1,2,3,4]
export const srsRetentionKey = {
  vocab: 0.98,
  sentences: 0.95,
  topic: 0.95,
  media: 0.93,
};
export const srsRetentionKeyTypes = {
  vocab: 'vocab',
  sentences: 'sentences',
  topic: 'topic',
  media: 'media',
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
// const nextScheduledOptions = {
//   '1': {
//     card: {
//       due: '2024-10-10T12:23:45.044Z',
//       stability: 0.4072,
//       difficulty: 7.2102,
//       elapsed_days: 0,
//       scheduled_days: 0,
//       reps: 1,
//       lapses: 0,
//       state: 1,
//       last_review: '2024-10-10T12:22:45.044Z',
//       ease: 2.5,
//       interval: 0,
//     },
//     log: {
//       rating: 1,
//       state: 0,
//       due: '2024-10-10T12:22:45.043Z',
//       stability: 0,
//       difficulty: 0,
//       elapsed_days: 0,
//       last_elapsed_days: 0,
//       scheduled_days: 0,
//       review: '2024-10-10T12:22:45.044Z',
//     },
//   },
//   '2': {
//     card: {
//       due: '2024-10-10T12:27:45.044Z',
//       stability: 1.1829,
//       difficulty: 6.50854722,
//       elapsed_days: 0,
//       scheduled_days: 0,
//       reps: 1,
//       lapses: 0,
//       state: 1,
//       last_review: '2024-10-10T12:22:45.044Z',
//       ease: 2.5,
//       interval: 0,
//     },
//     log: {
//       rating: 2,
//       state: 0,
//       due: '2024-10-10T12:22:45.043Z',
//       stability: 0,
//       difficulty: 0,
//       elapsed_days: 0,
//       last_elapsed_days: 0,
//       scheduled_days: 0,
//       review: '2024-10-10T12:22:45.044Z',
//     },
//   },
//   '3': {
//     card: {
//       due: '2024-10-10T12:32:45.044Z',
//       stability: 3.1262,
//       difficulty: 5.31457783,
//       elapsed_days: 0,
//       scheduled_days: 0,
//       reps: 1,
//       lapses: 0,
//       state: 1,
//       last_review: '2024-10-10T12:22:45.044Z',
//       ease: 2.5,
//       interval: 0,
//     },
//     log: {
//       rating: 3,
//       state: 0,
//       due: '2024-10-10T12:22:45.043Z',
//       stability: 0,
//       difficulty: 0,
//       elapsed_days: 0,
//       last_elapsed_days: 0,
//       scheduled_days: 0,
//       review: '2024-10-10T12:22:45.044Z',
//     },
//   },
//   '4': {
//     card: {
//       due: '2024-10-13T12:22:45.044Z',
//       stability: 15.4722,
//       difficulty: 3.2828565,
//       elapsed_days: 0,
//       scheduled_days: 3,
//       reps: 1,
//       lapses: 0,
//       state: 2,
//       last_review: '2024-10-10T12:22:45.044Z',
//       ease: 2.5,
//       interval: 0,
//     },
//     log: {
//       rating: 4,
//       state: 0,
//       due: '2024-10-10T12:22:45.043Z',
//       stability: 0,
//       difficulty: 0,
//       elapsed_days: 0,
//       last_elapsed_days: 0,
//       scheduled_days: 0,
//       review: '2024-10-10T12:22:45.044Z',
//     },
//   },
// };

// export const createCardWithPreviousDueDate = () => {};

export const getEmptyCard = () => {
  const card = createEmptyCard() as any;
  card.ease = 2.5; // Default ease factor for a new card
  card.interval = 0; // Initial interval for a new card
  card.state = 'new'; // Set the card state
  return card;
};

export const reviewDataAlgo = ({contentType, card, grade}) => {
  const f = initFsrs({contentType});

  const nextReview = f.repeat(card, new Date()) as any;
  // console.log('## ', JSON.stringify(nextReview));

  // Manually update card properties if repeat didn't update them
  if (!nextReview?.last_review) {
    card.last_review = new Date(); // Set the last review date to now
    card.state = 'reviewed'; // Update state to indicate it's been reviewed
  }
  const postReviewedCard = nextReview[grade].card;
  // console.log('## Card after: ', postReviewedCard);
  // console.log('## Card after (nextReview): ', JSON.stringify(nextReview));
  return postReviewedCard;
};

// const existingCard = {
//   due: '2024-10-09T18:18:35.063Z',
//   stability: 0.4072,
//   difficulty: 7.2102,
//   elapsed_days: 0,
//   scheduled_days: 0,
//   reps: 1,
//   lapses: 0,
//   state: 1,
//   last_review: '2024-10-09T18:17:35.063Z',
//   ease: 2.5,
//   interval: 0,
// };
// const oldExistingCard = {
//   due: '2024-09-09T18:18:35.063Z',
//   stability: 0.4072,
//   difficulty: 7.2102,
//   elapsed_days: 0,
//   scheduled_days: 0,
//   reps: 1,
//   lapses: 0,
//   state: 1,
//   last_review: '2024-08-09T18:17:35.063Z',
//   ease: 2.5,
//   interval: 0,
// };
// reviewData({ contentType: 'vocab', grade: 4, card: oldExistingCard });

// const repeatObj = {
//   '1': {
//     card: {
//       due: '2024-10-10T11:46:56.290Z',
//       stability: 0.4072,
//       difficulty: 7.2102,
//       elapsed_days: 0,
//       scheduled_days: 0,
//       reps: 1,
//       lapses: 0,
//       state: 1,
//       last_review: '2024-10-10T11:45:56.290Z',
//       ease: 2.5,
//       interval: 0,
//     },
//     log: {
//       rating: 1,
//       state: 0,
//       due: '2024-10-10T11:45:56.285Z',
//       stability: 0,
//       difficulty: 0,
//       elapsed_days: 0,
//       last_elapsed_days: 0,
//       scheduled_days: 0,
//       review: '2024-10-10T11:45:56.290Z',
//     },
//   },
//   '2': {
//     card: {
//       due: '2024-10-10T11:50:56.290Z',
//       stability: 1.1829,
//       difficulty: 6.50854722,
//       elapsed_days: 0,
//       scheduled_days: 0,
//       reps: 1,
//       lapses: 0,
//       state: 1,
//       last_review: '2024-10-10T11:45:56.290Z',
//       ease: 2.5,
//       interval: 0,
//     },
//     log: {
//       rating: 2,
//       state: 0,
//       due: '2024-10-10T11:45:56.285Z',
//       stability: 0,
//       difficulty: 0,
//       elapsed_days: 0,
//       last_elapsed_days: 0,
//       scheduled_days: 0,
//       review: '2024-10-10T11:45:56.290Z',
//     },
//   },
//   '3': {
//     card: {
//       due: '2024-10-10T11:55:56.290Z',
//       stability: 3.1262,
//       difficulty: 5.31457783,
//       elapsed_days: 0,
//       scheduled_days: 0,
//       reps: 1,
//       lapses: 0,
//       state: 1,
//       last_review: '2024-10-10T11:45:56.290Z',
//       ease: 2.5,
//       interval: 0,
//     },
//     log: {
//       rating: 3,
//       state: 0,
//       due: '2024-10-10T11:45:56.285Z',
//       stability: 0,
//       difficulty: 0,
//       elapsed_days: 0,
//       last_elapsed_days: 0,
//       scheduled_days: 0,
//       review: '2024-10-10T11:45:56.290Z',
//     },
//   },
//   '4': {
//     card: {
//       due: '2024-10-25T11:45:56.290Z',
//       stability: 15.4722,
//       difficulty: 3.2828565,
//       elapsed_days: 0,
//       scheduled_days: 15,
//       reps: 1,
//       lapses: 0,
//       state: 2,
//       last_review: '2024-10-10T11:45:56.290Z',
//       ease: 2.5,
//       interval: 0,
//     },
//     log: {
//       rating: 4,
//       state: 0,
//       due: '2024-10-10T11:45:56.285Z',
//       stability: 0,
//       difficulty: 0,
//       elapsed_days: 0,
//       last_elapsed_days: 0,
//       scheduled_days: 0,
//       review: '2024-10-10T11:45:56.290Z',
//     },
//   },
// };

// const nextObj = {
//   card: {
//     due: '2024-10-25T11:50:33.453Z',
//     stability: 15.4722,
//     difficulty: 3.2828565,
//     elapsed_days: 0,
//     scheduled_days: 15,
//     reps: 1,
//     lapses: 0,
//     state: 2,
//     last_review: '2024-10-10T11:50:33.453Z',
//     ease: 2.5,
//     interval: 0,
//   },
//   log: {
//     rating: 4,
//     state: 0,
//     due: '2024-10-10T11:50:33.452Z',
//     stability: 0,
//     difficulty: 0,
//     elapsed_days: 0,
//     last_elapsed_days: 0,
//     scheduled_days: 0,
//     review: '2024-10-10T11:50:33.453Z',
//   },
// };
