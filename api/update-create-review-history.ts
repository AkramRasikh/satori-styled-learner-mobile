import {BACKEND_ENDPOINT} from '@env';

export const updateCreateReviewHistory = async ({
  contentEntry,
  fieldToUpdate,
  language,
}) => {
  const url = BACKEND_ENDPOINT + '/update-content';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        title: contentEntry,
        fieldToUpdate,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseToJSON = await response.json();

    return responseToJSON;
  } catch (error) {
    console.log('## updateCreateReviewHistory error: ', error);
  }
};
