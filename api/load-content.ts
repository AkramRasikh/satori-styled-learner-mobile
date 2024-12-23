import {adhocSentences, content, snippets, words, sentences} from '../refs';
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
        refs: [content, snippets, words, sentences],
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
      getNestedObjectData(sentences)?.sentences || [];

    const data = {
      content: targetLanguageLoadedContent,
      words: targetLanguageLoadedWords,
      snippets: targetLanguageLoadedSnippets,
      sentences: targetLanguageLoadedSentences,
    };

    const dataStorageKeyPrefix = `${language}-data-`;
    await storeDataLocalStorage(dataStorageKeyPrefix + content, data.content);
    await storeDataLocalStorage(dataStorageKeyPrefix + words, data.words);
    await storeDataLocalStorage(dataStorageKeyPrefix + snippets, data.snippets);
    await storeDataLocalStorage(
      dataStorageKeyPrefix + sentences,
      data.sentences,
    );
    await storeDataLocalStorage(
      dataStorageKeyPrefix + adhocSentences,
      data.sentences,
    );
    return data;
  } catch (error) {
    console.error('## Error getFreshData', error);
  }
};

const getAllDataLocally = async ({language}) => {
  try {
    const dataStorageKeyPrefix = `${language}-data-`;
    const contentData = await getLocalStorageData(
      dataStorageKeyPrefix + content,
    );
    if (!contentData) {
      return null;
    }
    const wordsData = await getLocalStorageData(dataStorageKeyPrefix + words);
    const snippetsData = await getLocalStorageData(
      dataStorageKeyPrefix + snippets,
    );
    const sentencesData = await getLocalStorageData(
      dataStorageKeyPrefix + adhocSentences,
    );

    return {
      content: contentData,
      words: wordsData,
      snippets: snippetsData,
      sentences: sentencesData,
    };
  } catch (error) {
    console.log('## Error getAllDataLocally', error);
  }
};

export const getAllData = async ({language, freshData}) => {
  try {
    if (!freshData) {
      const storageData = await getAllDataLocally({language});
      return storageData ?? (await getFreshData({language}));
    }

    return await getFreshData({language});
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      content: [],
      words: [],
      snippets: [],
      sentences: [],
    };
  }
};
