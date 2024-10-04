import {
  japaneseAdhocSentences,
  japaneseContent,
  japaneseSentences,
  japaneseSnippets,
  japaneseSongs,
  japaneseWords,
} from '../refs';
import {BACKEND_ENDPOINT} from '@env';
import mockTopicsToStudy from '../mock-firestore/mock-topics-to-study.json';
import mockGetAllRes from '../mock-firestore/mock-get-all-res.json';
import {getTopicsToStudy} from './words-to-study';

export const loadInContent = async ({ref}) => {
  const url = BACKEND_ENDPOINT + '/firebase-data';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref,
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
        refs: [
          japaneseWords,
          japaneseSentences,
          japaneseSnippets,
          japaneseSongs,
          japaneseContent,
          japaneseAdhocSentences,
        ],
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

    const japaneseLoadedContent = getNestedObjectData(
      japaneseContent,
    ).japaneseContent.filter(item => item !== null);

    const japaneseLoadedWords =
      getNestedObjectData(japaneseWords).japaneseWords;
    const japaneseLoadedSentences =
      getNestedObjectData(japaneseSentences).japaneseSentences;
    const japaneseLoadedSnippets =
      getNestedObjectData(japaneseSnippets).japaneseSnippets;
    const japaneseLoadedSongs =
      getNestedObjectData(japaneseSongs).japaneseSongs;
    const japaneseAdhocLoadedSentences = getNestedObjectData(
      japaneseAdhocSentences,
    ).japaneseAdhocSentences;

    return {
      japaneseLoadedContent,
      japaneseLoadedWords,
      japaneseLoadedSentences,
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
      japaneseLoadedSentences: [],
      japaneseLoadedSnippets: [],
      japaneseLoadedSongs: [],
      japaneseAdhocLoadedSentences: [],
      topicsToStudy: [],
    };
  }
};
