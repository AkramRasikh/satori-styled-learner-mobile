import {
  adhocSentences,
  content,
  japanese,
  snippets,
  songs,
  words,
} from '../refs';
import {BACKEND_ENDPOINT} from '@env';
import mockTopicsToStudy from '../mock-firestore/mock-topics-to-study.json';
import mockGetAllRes from '../mock-firestore/mock-get-all-res.json';
import {getTopicsToStudy} from './words-to-study';

const loadAllContent = async () => {
  const url = BACKEND_ENDPOINT + '/firebase-data-mobile';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json', //<----
        'Content-Type': 'application/json', //<---
      },
      body: JSON.stringify({
        language: japanese,
        refs: [adhocSentences, content, snippets, songs, words],
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

export const getAllData = async () => {
  const withMock = process.env.USE_MOCK_DB;

  try {
    const loadedData = withMock ? mockGetAllRes : await loadAllContent();

    const topicsToStudy = withMock
      ? mockTopicsToStudy
      : await getTopicsToStudy();

    const getNestedObjectData = thisRef => {
      return loadedData.find(el => {
        const dataKeys = Object.keys(el);
        if (dataKeys.includes(thisRef)) {
          return el;
        }
      });
    };

    const japaneseLoadedContent = getNestedObjectData(content).content.filter(
      item => item !== null,
    );

    const japaneseLoadedWords = getNestedObjectData(words).words;
    const japaneseLoadedSnippets = getNestedObjectData(snippets).snippets;
    const japaneseLoadedSongs = getNestedObjectData(songs).songs;
    const japaneseAdhocLoadedSentences =
      getNestedObjectData(adhocSentences).adhocSentences;

    return {
      japaneseLoadedContent,
      japaneseLoadedWords,
      japaneseLoadedSnippets,
      japaneseLoadedSongs,
      japaneseAdhocLoadedSentences,
      topicsToStudy,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      satoriData: [],
      contextHelperData: [],
      japaneseLoadedSnippets: [],
      japaneseLoadedSongs: [],
      japaneseAdhocLoadedSentences: [],
      topicsToStudy: [],
    };
  }
};
