import {BACKEND_ENDPOINT} from '@env';

const addAdhocGrammarTTSAPI = async params => {
  const baseUrl = BACKEND_ENDPOINT;

  try {
    const response = await fetch(baseUrl + '/adhoc-grammar-tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
      }),
    });

    const res = await response.json();

    return res;
  } catch (error) {
    console.log('## Error addAdhocGrammarTTSAPI to text: ', error);
  }
};

export default addAdhocGrammarTTSAPI;
