import {BACKEND_ENDPOINT} from '@env';
import {japanese} from '../refs';

export const getTopicsToStudy = async () => {
  const url = BACKEND_ENDPOINT + '/topics-to-study';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: japanese,
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

export const getThisTopicsWordsToStudyAPI = async ({topic, isMusic}) => {
  const param = isMusic
    ? '/get-japanese-words-song'
    : '/get-japanese-words-topic';
  const url = BACKEND_ENDPOINT + param;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: japanese,
        topic,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseToJSON = await response.json();

    return responseToJSON;
  } catch (error) {
    console.log('## getThisTopicsWordsToStudyAPI error: ', error);
  }
};
