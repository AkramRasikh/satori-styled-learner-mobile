import {BACKEND_ENDPOINT} from '@env';

export const addSentenceAudioAPI = async ({language, id, sentence}) => {
  try {
    const response = await fetch(BACKEND_ENDPOINT + '/sentence-tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        id,
        sentence,
      }),
    });

    const res = await response.json();

    return res;
  } catch (error) {
    console.log('## Error addSentenceAudioAPI: ', error);
  }
};
