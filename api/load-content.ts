import {
  japaneseContent,
  japaneseContentFullMP3s,
  japaneseSentences,
  japaneseSnippets,
  japaneseSongs,
  japaneseWords,
} from '../refs';
import {BACKEND_ENDPOINT} from '@env';
import {getTopicsToStudy} from './words-to-study';
// import tempContentJson from './temp-content.json';

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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refs: [
          japaneseContent,
          japaneseWords,
          japaneseSentences,
          japaneseContentFullMP3s,
          japaneseSnippets,
          japaneseSongs,
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
  try {
    const loadedData = await loadAllContent();
    const topicsToStudy = await getTopicsToStudy();

    const getNestedObjectData = thisRef => {
      return loadedData.find(el => {
        const dataKeys = Object.keys(el);
        if (dataKeys.includes(thisRef)) {
          return el;
        }
      });
    };

    const japaneseLoadedContent =
      getNestedObjectData(japaneseContent).japaneseContent;
    const japaneseLoadedWords =
      getNestedObjectData(japaneseWords).japaneseWords;
    const japaneseLoadedSentences =
      getNestedObjectData(japaneseSentences).japaneseSentences;
    const japaneseLoadedContentFullMP3s = getNestedObjectData(
      japaneseContentFullMP3s,
    ).japaneseContentFullMP3s;
    const japaneseLoadedSnippets =
      getNestedObjectData(japaneseSnippets).japaneseSnippets;
    const japaneseLoadedSongs =
      getNestedObjectData(japaneseSongs).japaneseSongs;

    const topics =
      japaneseLoadedContent && Object.keys(japaneseLoadedContent).length > 0
        ? Object.keys(japaneseLoadedContent)
        : [];

    const getAdditionalContexts = wordFormsArr => {
      const [baseWord, surfaceWord] = wordFormsArr;

      return japaneseLoadedSentences.filter(sentence => {
        if (sentence.matchedWords.includes(baseWord)) {
          return true;
        }
        if (sentence.matchedWords.includes(surfaceWord)) {
          return true;
        }
        return false;
      });
    };

    const wordsByTopics = topics.map(topic => {
      const allIdsFromTopicSentences = japaneseLoadedContent[topic].map(
        item => item.id,
      );
      const filteredWordsThatHaveMatchingContext = japaneseLoadedWords.filter(
        japaneseWord =>
          japaneseWord.contexts.some(context =>
            allIdsFromTopicSentences.includes(context),
          ),
      );
      const wordsWithAdditionalContextAdded =
        filteredWordsThatHaveMatchingContext.map(japaneseWord => {
          const contexts = japaneseWord.contexts;
          const originalContext = japaneseLoadedContent[topic].find(
            contentWidget => contentWidget.id === contexts[0],
          );

          return {
            ...japaneseWord,
            contexts: [
              originalContext,
              ...getAdditionalContexts([
                japaneseWord.baseForm,
                japaneseWord.surfaceForm,
              ]),
            ],
          };
        });

      return wordsWithAdditionalContextAdded;
    });

    return {
      japaneseLoadedContent,
      japaneseLoadedWords,
      japaneseLoadedSentences,
      japaneseLoadedContentFullMP3s,
      japaneseLoadedSnippets,
      japaneseLoadedSongs,
      wordsByTopics,
      topicsToStudy,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      satoriData: [],
      contextHelperData: [],
      wordsByTopics: [],
      japaneseLoadedSentences: [],
      japaneseLoadedContentFullMP3s: [],
      japaneseLoadedSnippets: [],
      japaneseLoadedSongs: [],
      topicsToStudy: [],
    };
  }
};
