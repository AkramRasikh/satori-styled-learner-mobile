import {BACKEND_ENDPOINT} from '@env';

export const breakdownSentenceAPI = async ({
  topicName,
  sentenceId,
  language,
  targetLang,
}) => {
  const url = BACKEND_ENDPOINT + '/breakdown-sentence';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        title: topicName,
        id: sentenceId,
        targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseToJSON = await response.json();

    return responseToJSON;
  } catch (error) {
    console.log('## breakdownSentenceAPI error: ', error);
  }
};
