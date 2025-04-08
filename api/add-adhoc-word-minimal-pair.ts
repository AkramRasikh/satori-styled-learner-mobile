// const inputWord = req.body.inputWord;
// const language = req.body.language;
// const isMeaning = req.body.isMeaning; // antonym, synonym, functional
// const isVisual = req.body.isVisual;

import {BACKEND_ENDPOINT} from '@env';

interface addAdhocWordMinimalPairAPIProps {
  language: string;
  inputWord: {
    id: string;
    word: string;
    wordDefinition: string;
  };
  isMeaning?: string;
  isVisual?: boolean;
}

export const addAdhocWordMinimalPairAPI = async ({
  language,
  inputWord,
  isMeaning,
  isVisual,
}: addAdhocWordMinimalPairAPIProps) => {
  const baseUrl = BACKEND_ENDPOINT;

  try {
    const response = await fetch(baseUrl + '/minimal-pair-sound', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        inputWord,
        isMeaning,
        isVisual,
      }),
    });

    const res = await response.json();

    return res;
  } catch (error) {
    console.log('## Error addAdhocWordMinimalPairAPI to text: ', error);
  }
};
