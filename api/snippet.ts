import {ADD_SNIPPET_URL, DELETE_SNIPPET_URL} from '@env';
import {snippets} from '../refs';

export const addSnippetAPI = async ({contentEntry, language}) => {
  const url = ADD_SNIPPET_URL;

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
  const url = DELETE_SNIPPET_URL;

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
