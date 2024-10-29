import {BACKEND_ENDPOINT} from '@env';

export const getTopicsToStudy = async ({language}) => {
  const url = BACKEND_ENDPOINT + '/topics-to-study';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
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
