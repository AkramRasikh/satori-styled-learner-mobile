import {BACKEND_ENDPOINT} from '@env';

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
        adhocSentence: {
          baseLang,
          context,
        },
        topic,
        tags,
        nextReview,
      }),
    });

    console.log('## addAdhocSentenceAPI 1', {response});

    const res = await response.json();
    console.log('## addAdhocSentenceAPI 2', {res});

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
