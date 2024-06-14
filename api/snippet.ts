import {BACKEND_ENDPOINT} from '@env';
import {japaneseSnippets} from '../refs';

export const addSnippetAPI = async ({contentEntry}) => {
  const url = BACKEND_ENDPOINT + '/add-snippet';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: japaneseSnippets,
        contentEntry,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return contentEntry;
  } catch (error) {
    console.log('## addSnippet error: ', error);
  }
};
export const deleteSnippetAPI = async ({contentEntry}) => {
  const url = BACKEND_ENDPOINT + '/delete-snippet';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: japaneseSnippets,
        contentEntry,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return contentEntry;
  } catch (error) {
    console.log('## addSnippet error: ', error);
  }
};
