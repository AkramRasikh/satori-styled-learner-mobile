import {ADD_WORD_URL} from '@env';

const saveWordAPI = async ({
  highlightedWord,
  highlightedWordSentenceId,
  contextSentence,
  isGoogle,
  language,
  reviewData,
  meaning,
}) => {
  const baseUrl = ADD_WORD_URL;

  try {
    const response = await fetch(baseUrl, {
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
        meaning,
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
