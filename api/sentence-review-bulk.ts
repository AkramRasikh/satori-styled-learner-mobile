import {BACKEND_ENDPOINT} from '@env';

export const sentenceReviewBulkAPI = async ({
  title,
  fieldToUpdate,
  language,
}) => {
  const url = BACKEND_ENDPOINT + '/sentence-review-bulk';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        title,
        fieldToUpdate,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseToJSON = await response.json();

    return responseToJSON;
  } catch (error) {
    console.log('## sentenceReviewBulk error: ', error);
  }
};
