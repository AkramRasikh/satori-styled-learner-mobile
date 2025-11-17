import {UPDATE_CONTENT_META_URL} from '@env';

export const updateCreateReviewHistory = async ({
  title,
  fieldToUpdate,
  language,
  contentIndex,
}) => {
  const url = UPDATE_CONTENT_META_URL;

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
        contentIndex,
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
