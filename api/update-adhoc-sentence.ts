import {BACKEND_ENDPOINT} from '@env';

const updateAdhocSentenceAPI = async ({sentenceId, fieldToUpdate}) => {
  const baseUrl = BACKEND_ENDPOINT;
  const url = baseUrl + '/update-adhoc-sentence';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentenceId,
        fieldToUpdate,
      }),
    });

    const res = await response.json();

    return res;
  } catch (error) {
    console.log('## Error updateAdhocSentenceAPI to text: ', error);
  }
};

export default updateAdhocSentenceAPI;
