import {BACKEND_ENDPOINT} from '@env';

export const deleteWordAPI = async ({wordId, language}) => {
  const url = BACKEND_ENDPOINT + '/delete-word';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        id: wordId,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return wordId;
  } catch (error) {
    console.log('## deleteSnippetAPI error: ', error);
  }
};
