import {BACKEND_ENDPOINT} from '@env';

export const updateWordAPI = async ({wordId, fieldToUpdate}) => {
  const url = BACKEND_ENDPOINT + '/update-word';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wordId,
        fieldToUpdate,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseToJSON = await response.json();

    return responseToJSON;
  } catch (error) {
    console.log('## updateWordAPI error: ', error);
  }
};