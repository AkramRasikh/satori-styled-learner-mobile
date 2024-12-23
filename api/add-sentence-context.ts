import {BACKEND_ENDPOINT} from '@env';
import {
  getEmptyCard,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../srs-algo';

export const addSentenceContextAPI = async ({
  language,
  id,
  baseLang,
  targetLang,
  matchedWords,
  tokenised,
}) => {
  const cardDataRelativeToNow = getEmptyCard();
  const nextScheduledOptions = getNextScheduledOptions({
    card: cardDataRelativeToNow,
    contentType: srsRetentionKeyTypes.sentences,
  });

  const reviewData = nextScheduledOptions['1'].card;

  try {
    const response = await fetch(BACKEND_ENDPOINT + '/add-word-context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        id,
        baseLang,
        targetLang,
        matchedWords,
        tokenised,
        reviewData,
      }),
    });

    const res = await response.json();

    return res;
  } catch (error) {
    console.log('## Error addSentenceContext: ', error);
  }
};
