import {BACKEND_ENDPOINT} from '@env';

export const sentenceReviewBulkAllAPI = async ({topics, language}) => {
  const url = BACKEND_ENDPOINT + '/remove-all-content-review';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topics,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseToJSON = await response.json();

    return responseToJSON;
  } catch (error) {
    console.log('## sentenceReviewBulkAllAPI error: ', error);
  }
};
