import {BACKEND_ENDPOINT} from '@env';
import {japanese} from '../refs';

export const updateCreateReviewHistory = async ({
  contentEntry,
  fieldToUpdate,
}) => {
  const url = BACKEND_ENDPOINT + '/update-content';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: japanese,
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
