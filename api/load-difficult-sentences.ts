import {BACKEND_ENDPOINT} from '@env';

export const loadDifficultSentences = async () => {
  const url = BACKEND_ENDPOINT + '/get-hard-sentences';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseToJSON = await response.json();

    return responseToJSON;
  } catch (error) {
    console.log('## loadDifficultSentences error: ', error);
  }
};
