import {adhocSentences, content, snippets, words} from '../refs';
import {BACKEND_ENDPOINT} from '@env';
import mockGetAllRes from '../mock-firestore/mock-get-all-res.json';
import {
  getLocalStorageData,
  storeDataLocalStorage,
} from '../helper-functions/local-storage-utils';

const loadAllContent = async ({language}) => {
  const url = BACKEND_ENDPOINT + '/on-load-data';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json', //<----
        'Content-Type': 'application/json', //<---
      },
      body: JSON.stringify({
        language,
        refs: [adhocSentences, content, snippets, words],
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseToJSON = await response.json();

    return responseToJSON;
  } catch (error) {
    console.log('## loadInContent error: ', error);
  }
};

const getFreshData = async ({language}) => {
  const withMock = process.env.USE_MOCK_DB;
  const dataStorageKey = `${language}-data`;

  try {
    const loadedData = withMock
      ? mockGetAllRes
      : await loadAllContent({language});

    const getNestedObjectData = thisRef => {
      return loadedData.find(el => {
        const dataKeys = Object.keys(el);
        if (dataKeys.includes(thisRef)) {
          return el;
        }
      });
    };

    const targetLanguageLoadedContent = getNestedObjectData(
      content,
    ).content.filter(item => item !== null);

    const targetLanguageLoadedWords = getNestedObjectData(words)?.words || [];
    const targetLanguageLoadedSnippets =
      getNestedObjectData(snippets)?.snippets || [];
    const targetLanguageLoadedSentences =
      getNestedObjectData(adhocSentences)?.adhocSentences || [];

    const data = {
      targetLanguageLoadedContent,
      targetLanguageLoadedWords,
      targetLanguageLoadedSnippets,
      targetLanguageLoadedSentences,
    };

    await storeDataLocalStorage(dataStorageKey, data);
    return data;
  } catch (error) {
    console.error('## Error getFreshData', error);
  }
};

export const getAllData = async ({language, freshData}) => {
  const dataStorageKey = `${language}-data`;

  try {
    if (!freshData) {
      const storageData = await getLocalStorageData(dataStorageKey);
      return storageData ?? (await getFreshData({language}));
    }

    return await getFreshData({language});
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      satoriData: [],
      contextHelperData: [],
      targetLanguageLoadedSnippets: [],
      targetLanguageLoadedSentences: [],
    };
  }
};
