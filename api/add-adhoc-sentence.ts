import {BACKEND_ENDPOINT} from '@env';
import {japanese} from '../refs';

const addAdhocSentenceAPI = async ({
  baseLang,
  context,
  topic,
  tags,
  nextReview,
}) => {
  const baseUrl = BACKEND_ENDPOINT;
  try {
    const response = await fetch(baseUrl + '/add-adhoc-sentence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: japanese,
        adhocSentence: {
          baseLang,
          context,
        },
        topic,
        tags,
        nextReview, // needs to be changed
      }),
    });

    const res = await response.json();

    return {
      id: res.id,
      targetLang: res.targetLang,
      baseLang: res.baseLang,
      context: res.context,
      hasAudio: res.hasAudio,
      notes: res?.notes || '',
    };
  } catch (error) {
    console.log('## Error addAdhocSentenceAPI to text: ', error);
  }
};

export default addAdhocSentenceAPI;
