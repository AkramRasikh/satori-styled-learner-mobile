import {UPDATE_WORD_URL} from '@env';

export const updateWordAPI = async ({wordId, fieldToUpdate, language}) => {
  const url = UPDATE_WORD_URL;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: wordId,
        language,
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
