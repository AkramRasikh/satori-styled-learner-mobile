import {BACKEND_ENDPOINT} from '@env';

const saveWordAPI = async ({
  highlightedWord,
  highlightedWordSentenceId,
  contextSentence,
  isGoogle,
  language,
  reviewData,
}) => {
  const baseUrl = BACKEND_ENDPOINT;

  try {
    const response = await fetch(baseUrl + '/add-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        word: highlightedWord,
        context: highlightedWordSentenceId,
        contextSentence,
        isGoogle,
        reviewData,
      }),
    });

    const res = await response.json();
    const wordAdded = res.word;

    return wordAdded;
  } catch (error) {
    console.log('## Error saveWordAPI to text: ', error);
  }
};

export default saveWordAPI;
