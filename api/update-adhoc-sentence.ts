import {UPDATE_ADHOC_SENTENCE_URL} from '@env';

const updateAdhocSentenceAPI = async ({
  sentenceId,
  fieldToUpdate,
  language,
}) => {
  const url = UPDATE_ADHOC_SENTENCE_URL;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        id: sentenceId,
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
