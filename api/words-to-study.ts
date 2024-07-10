import {BACKEND_ENDPOINT} from '@env';

export const getTopicsToStudy = async () => {
  const url = BACKEND_ENDPOINT + '/topics-to-study';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseToJSON = await response.json();
    console.log('## ', {responseToJSON});

    return responseToJSON;
  } catch (error) {
    console.log('## getTopicsToStudy error: ', error);
  }
};
