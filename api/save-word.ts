import {BACKEND_ENDPOINT} from '@env';

const saveWordAPI = async ({highlightedWord, highlightedWordSentenceId}) => {
  const baseUrl = BACKEND_ENDPOINT;

  try {
    const response = await fetch(baseUrl + '/add-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word: highlightedWord,
        contexts: [highlightedWordSentenceId],
      }),
    });

    const res = await response.json();
    const wordAdded = res.word;

    return wordAdded;
  } catch (error) {
    console.log('## Error chatGPT to text: ', error);
  }
};

export default saveWordAPI;
