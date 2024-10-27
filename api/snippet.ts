import {BACKEND_ENDPOINT} from '@env';
import {snippets} from '../refs';

export const addSnippetAPI = async ({contentEntry, language}) => {
  const url = BACKEND_ENDPOINT + '/add-snippet';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        snippet: contentEntry,
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
export const deleteSnippetAPI = async ({snippetId, language}) => {
  const url = BACKEND_ENDPOINT + '/delete-snippet';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        ref: snippets,
        id: snippetId,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return snippetId;
  } catch (error) {
    console.log('## deleteSnippetAPI error: ', error);
  }
};
