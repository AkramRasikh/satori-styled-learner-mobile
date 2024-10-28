import {adhocSentences, content, snippets, songs, words} from '../refs';
import {BACKEND_ENDPOINT} from '@env';
import mockTopicsToStudy from '../mock-firestore/mock-topics-to-study.json';
import mockGetAllRes from '../mock-firestore/mock-get-all-res.json';
import {getTopicsToStudy} from './words-to-study';

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

export const getAllData = async ({language}) => {
  const withMock = process.env.USE_MOCK_DB;

  try {
    const loadedData = withMock
      ? mockGetAllRes
      : await loadAllContent({language});

    const topicsToStudy = withMock
      ? mockTopicsToStudy
      : await getTopicsToStudy({language});

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
    const targetLanguageLoadedSongs = getNestedObjectData(songs)?.songs || [];
    const targetLanguageLoadedSentences =
      getNestedObjectData(adhocSentences)?.adhocSentences || [];

    return {
      targetLanguageLoadedContent,
      targetLanguageLoadedWords,
      targetLanguageLoadedSnippets,
      targetLanguageLoadedSongs,
      targetLanguageLoadedSentences,
      topicsToStudy,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      satoriData: [],
      contextHelperData: [],
      targetLanguageLoadedSnippets: [],
      targetLanguageLoadedSongs: [],
      targetLanguageLoadedSentences: [],
      topicsToStudy: [],
    };
  }
};
