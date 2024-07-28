import {BACKEND_ENDPOINT} from '@env';

export const updateCreateReviewHistory = async ({
  ref,
  contentEntry,
  fieldToUpdate,
}) => {
  const url = BACKEND_ENDPOINT + '/update-review';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref,
        contentEntry,
        fieldToUpdate,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseToJSON = await response.json();

    return responseToJSON;
  } catch (error) {
    console.log('## getTopicsToStudy error: ', error);
  }
};
