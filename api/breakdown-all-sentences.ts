import {BACKEND_ENDPOINT} from '@env';

export const breakdownAllSentencesAPI = async ({
  topicName,
  sentences,
  language,
}) => {
  const url = BACKEND_ENDPOINT + '/breakdown-all-sentences';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        title: topicName,
        sentences,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseToJSON = await response.json();

    return responseToJSON;
  } catch (error) {
    console.log('## breakdownAllSentencesAPI error: ', error);
  }
};
