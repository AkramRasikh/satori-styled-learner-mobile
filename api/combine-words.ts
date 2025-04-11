import {BACKEND_ENDPOINT} from '@env';

interface CombineWordsAPIProps {
  language: string;
  myCombinedSentence?: string;
  inputWords: {
    word: string;
    wordDefinition: string;
    context: string;
  }[];
}

export const combineWordsAPI = async ({
  language,
  inputWords,
  myCombinedSentence,
}: CombineWordsAPIProps) => {
  const baseUrl = BACKEND_ENDPOINT;

  try {
    const response = await fetch(baseUrl + '/combine-words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({language, inputWords, myCombinedSentence}),
    });

    const res = await response.json();

    return res;
  } catch (error) {
    console.log('## Error combineWordsAPI to text: ', error);
  }
};
