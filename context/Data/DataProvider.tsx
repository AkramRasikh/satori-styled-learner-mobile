import React from 'react';
import {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllData} from '../../api/load-content';
import {updateSentenceDataAPI} from '../../api/update-sentence-data';
import addAdhocSentenceAPI from '../../api/add-adhoc-sentence';
import {setFutureReviewDate} from '../../components/ReviewSection';
import updateAdhocSentenceAPI from '../../api/update-adhoc-sentence';
import {addSnippetAPI, deleteSnippetAPI} from '../../api/snippet';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import saveWordAPI from '../../api/save-word';
import useLanguageSelector from '../LanguageSelector/useLanguageSelector';
import {adhocSentences, content, snippets, words} from '../../refs';
import {storeDataLocalStorage} from '../../helper-functions/local-storage-utils';
import {updateCreateReviewHistory} from '../../api/update-create-review-history';
import {sentenceReviewBulkAPI} from '../../api/sentence-review-bulk';
import {combineWordsAPI} from '../../api/combine-words';
import {addSentenceContextAPI} from '../../api/add-sentence-context';
import {addSentenceAudioAPI} from '../../api/add-sentence-audio';
import {setLearningContentStateDispatch} from '../../store/contentSlice';
import {setWordsStateDispatch} from '../../store/wordSlice';
import {setSentencesStateDispatch} from '../../store/sentencesSlice';
import {setSnippetsStateDispatch} from '../../store/snippetsSlice';
import {deleteWordAPI} from '../../api/delete-word';
import {updateWordAPI} from '../../api/update-word-data';

export const DataContext = createContext(null);

const combineSentenceResponseExample = [
  {
    id: 'c394a0dc-27b8-4ad7-8b5f-1d29fb9f5100',
    baseLang:
      'In the first place, the most important thing was to maintain independence as a country.',
    targetLang: 'まず何よりも大切だったことは国としての独立を維持すること。',
    matchedWords: ['独立', '維持'],
    tokenised: [
      'まず',
      '何',
      'より',
      'も',
      '大切',
      'だっ',
      'た',
      'こと',
      'は',
      '国',
      'として',
      'の',
      '独立',
      'を',
      '維持',
      'する',
      'こと',
      '。',
    ],
  },
  {
    id: '4b2b8186-ca92-4bf9-85d3-8c75ae547cca',
    baseLang:
      'When we look towards Europe and America, the great powers are expanding into Asia.',
    targetLang: '向けてみると欧米列強がアジアへ進出してきて。',
    matchedWords: ['欧米'],
    tokenised: [
      '向け',
      'て',
      'みる',
      'と',
      '欧米',
      '列強',
      'が',
      'アジア',
      'へ',
      '進出',
      'し',
      'て',
      'き',
      'て',
      '。',
    ],
  },
  {
    id: '115d0e4d-1133-4f69-8140-597ad2cb804f',
    baseLang:
      'Maintaining independence is critical, especially when observing the expansion of Europe and America.',
    targetLang: '欧米の進出を見ると、特に独立を維持することが重要です。',
    matchedWords: ['独立', '維持', '欧米'],
    tokenised: [
      '欧米',
      'の',
      '進出',
      'を',
      '見る',
      'と',
      '、',
      '特に',
      '独立',
      'を',
      '維持',
      'する',
      'こと',
      'が',
      '重要',
      'です',
      '。',
    ],
  },
  {
    id: 'fdc98d64-cffc-46a3-a090-2af6d87c5be3',
    baseLang:
      'The great powers of Europe and America keep their independence, and this is very important.',
    targetLang: '欧米の列強は独立を維持し、これは非常に重要です。',
    matchedWords: ['独立', '維持', '欧米'],
    tokenised: [
      '欧米',
      'の',
      '列強',
      'は',
      '独立',
      'を',
      '維持',
      'し',
      '、',
      'これ',
      'は',
      '非常',
      'に',
      '重要',
      'です',
      '。',
    ],
  },
];

export const DataProvider = ({children}: PropsWithChildren<{}>) => {
  const [updatingSentenceState, setUpdatingSentenceState] = useState('');
  const [dataProviderIsLoading, setDataProviderIsLoading] = useState(true);
  const [loadingCombineSentences, setLoadingCombineSentences] = useState(false);
  const [provdiderError, setProvdiderError] = useState(null);
  const [updatePromptState, setUpdatePromptState] = useState('');
  const [isAdhocDataLoading, setIsAdhocDataLoading] = useState(false);
  const [structuredUnifiedData, setStructuredUnifiedData] = useState([]);
  const [combineWordsListState, setCombineWordsListState] = useState([]);
  const [updateMetaDataState, setUpdateMetaDataState] = useState(0);
  // const [combineWordsListState, setCombineWordsListState] = useState(
  //   combineSentenceResponseExample,
  // );
  const adhocTargetLanguageSentencesState = useSelector(
    state => state.sentences,
  );
  const targetLanguageSnippetsState = useSelector(state => state.snippets);
  const targetLanguageWordsState = useSelector(state => state.words);
  const targetLanguageLoadedContentMasterState = useSelector(
    state => state.learningContent,
  );
  const dispatch = useDispatch();

  const {languageSelectedState: language} = useLanguageSelector();
  const dataStorageKeyPrefix = `${language}-data-`;

  const getPureWords = () => {
    let pureWords = [];

    targetLanguageWordsState?.forEach(wordData => {
      if (wordData?.baseForm) {
        pureWords.push(wordData.baseForm);
      }
      if (wordData?.surfaceForm) {
        pureWords.push(wordData.surfaceForm);
      }
    });

    const pureWordsUnique =
      pureWords?.length > 0 ? makeArrayUnique(pureWords) : [];
    return pureWordsUnique;
  };

  const pureWordsArr = getPureWords();

  const updateLoadedContentStateAfterSentenceUpdate = ({
    sentenceId,
    resObj,
    contentIndex,
  }) => {
    const updatedState = [...targetLanguageLoadedContentMasterState];
    const thisTopicData = updatedState[contentIndex];

    const updatedContent = thisTopicData.content.map(sentenceData => {
      if (sentenceData.id === sentenceId) {
        return {
          ...sentenceData,
          ...resObj,
        };
      }
      return sentenceData;
    });

    updatedState[contentIndex] = {
      ...thisTopicData,
      content: updatedContent,
    };

    dispatch(setLearningContentStateDispatch(updatedState));
    return updatedState;
  };

  const updatePromptFunc = (promptText, time) => {
    setUpdatePromptState(promptText);
    setTimeout(() => setUpdatePromptState(''), time);
  };

  const updateContentMetaData = async ({
    topicName,
    fieldToUpdate,
    contentIndex,
  }) => {
    try {
      const resObj = await updateCreateReviewHistory({
        title: topicName,
        fieldToUpdate,
        language,
      });
      if (resObj) {
        const updatedState = [...targetLanguageLoadedContentMasterState];
        const thisTopicData = updatedState[contentIndex];
        const newTopicState = {...thisTopicData, ...resObj};
        updatedState[contentIndex] = {
          ...newTopicState,
        };
        dispatch(setLearningContentStateDispatch(updatedState));
        setUpdateMetaDataState(prev => prev + 1);
        await storeDataLocalStorage(
          dataStorageKeyPrefix + content,
          updatedState,
        );
        updatePromptFunc(`${topicName} updated!`, 2000);
        return newTopicState;
      }
    } catch (error) {
      updatePromptFunc(`Error updating ${topicName}!`, 1000);
    }
  };

  const combineWords = async ({inputWords}) => {
    try {
      setLoadingCombineSentences(true);
      const combineWordsRes = await combineWordsAPI({inputWords, language});
      setCombineWordsListState(combineWordsRes);
    } catch (error) {
      updatePromptFunc('Error combining words', 1000);
    } finally {
      setTimeout(() => setLoadingCombineSentences(false), 2000);
    }
  };

  const sentenceReviewBulk = async ({
    fieldToUpdate,
    topicName,
    contentIndex,
    removeReview,
  }) => {
    try {
      const updatedContentRes = await sentenceReviewBulkAPI({
        title: topicName,
        fieldToUpdate,
        language,
        removeReview,
      });

      if (updatedContentRes) {
        const updatedState = [...targetLanguageLoadedContentMasterState];
        const thisTopicData = updatedState[contentIndex];
        const newTopicState = {...thisTopicData, ...updatedContentRes};
        updatedState[contentIndex] = {
          ...newTopicState,
        };
        dispatch(setLearningContentStateDispatch(updatedState));
        await storeDataLocalStorage(
          dataStorageKeyPrefix + content,
          updatedState,
        );
        updatePromptFunc(`${topicName} updated!`, 2000);
        return newTopicState;
      }
    } catch (error) {
      updatePromptFunc(`Error updating ${topicName}!`, 1000);
    }
  };

  const handleUpdateAdhocSentenceDifficult = async ({
    sentenceId,
    fieldToUpdate,
  }) => {
    try {
      const res = await updateAdhocSentenceAPI({
        sentenceId,
        fieldToUpdate,
        language,
      });
      return {
        isAdhoc: true,
        ...res,
      };
    } catch (error) {
      updatePromptFunc('Error saving updating adhoc sentence', 2000);
    }
  };

  const updateSentenceData = async ({
    topicName,
    sentenceId,
    fieldToUpdate,
    isAdhoc,
    contentIndex,
  }) => {
    try {
      setUpdatingSentenceState(sentenceId);
      const resObj = isAdhoc
        ? await handleUpdateAdhocSentenceDifficult({
            sentenceId,
            fieldToUpdate,
          })
        : await updateSentenceDataAPI({
            topicName,
            sentenceId,
            fieldToUpdate,
            language,
          });

      if (!isAdhoc) {
        const updatedContentState = updateLoadedContentStateAfterSentenceUpdate(
          {
            sentenceId,
            resObj,
            contentIndex,
          },
        );
        await storeDataLocalStorage(
          dataStorageKeyPrefix + content,
          updatedContentState,
        );
      }
      updatePromptFunc(`${topicName} updated!`, 2000);
      return resObj;
    } catch (error) {
      console.log('## updateSentenceData', {error});
      updatePromptFunc(`Error updating sentence for ${topicName}`, 2000);
    } finally {
      setUpdatingSentenceState('');
    }
  };

  const getSentenceAudio = async ({id, sentence}) => {
    try {
      const res = await addSentenceAudioAPI({language, id, sentence});
      return res;
    } catch (error) {
      updatePromptFunc(`Error getting audio for  ${sentence}`, 2000);
    }
  };

  const addSentenceContext = async contextData => {
    try {
      const contextWordsAddedResponse = await addSentenceContextAPI({
        language,
        ...contextData,
      });
      const contextIds = contextWordsAddedResponse.map(item => item.id);
      return contextIds;
    } catch (error) {
      updatePromptFunc('Error adding context data', 2000);
    }
  };

  const bulkAddReviews = async ({topicName, sentencesArray, contentIndex}) => {
    const res = await Promise.all(
      // currently returning content for each arr
      sentencesArray.map(
        async sentenceData =>
          await updateSentenceViaContent({
            topicName,
            sentenceId: sentenceData.id,
            fieldToUpdate: sentenceData.fieldToUpdate,
            contentIndex,
          }),
      ),
    );

    return res;
  };

  const updateSentenceViaContent = async ({
    topicName,
    sentenceId,
    fieldToUpdate,
    contentIndex,
  }) => {
    try {
      setUpdatingSentenceState(sentenceId);
      const resObj = await updateSentenceDataAPI({
        topicName,
        sentenceId,
        fieldToUpdate,
        language,
      });
      const updatedContentState = updateLoadedContentStateAfterSentenceUpdate({
        sentenceId,
        resObj,
        contentIndex,
      });
      await storeDataLocalStorage(
        dataStorageKeyPrefix + content,
        updatedContentState,
      );
      updatePromptFunc(`${topicName} updated!`, 2000);
      return updatedContentState[contentIndex];
    } catch (error) {
      console.log('## updateSentenceViaContent', {error});
      updatePromptFunc(`Error updating sentence for ${topicName}`, 2000);
    } finally {
      setUpdatingSentenceState('');
    }
  };

  const addAdhocSentenceFunc = async ({baseLang, context, topic, tags}) => {
    try {
      const adhocObject = await addAdhocSentenceAPI({
        baseLang,
        context,
        topic,
        tags,
        nextReview: setFutureReviewDate(new Date(), 3), // update here!
      });
      setIsAdhocDataLoading(true);
      const updatedAdhocSentencesState = [
        ...adhocTargetLanguageSentencesState,
        adhocObject,
      ];
      dispatch(setSentencesStateDispatch(updatedAdhocSentencesState));
      await storeDataLocalStorage(
        dataStorageKeyPrefix + adhocSentences,
        updatedAdhocSentencesState,
      );
      return adhocObject;
    } catch (error) {
      setProvdiderError('Error adding adhoc sentence');
      setTimeout(() => setProvdiderError(null), 3000);
    } finally {
      setIsAdhocDataLoading(false);
    }
  };

  const addSnippet = async snippetData => {
    try {
      const snippetDataFromAPI = await addSnippetAPI({
        contentEntry: snippetData,
        language,
      });

      const updatedSnippets = [
        ...targetLanguageSnippetsState,
        {...snippetDataFromAPI, saved: true},
      ];
      dispatch(setSnippetsStateDispatch(updatedSnippets));
      await storeDataLocalStorage(
        dataStorageKeyPrefix + snippets,
        updatedSnippets,
      );
      return snippetDataFromAPI;
    } catch (error) {
      updatePromptFunc('❌☠️ Error adding snippet', 2000);
    }
  };

  const updateWordData = async ({wordId, wordBaseForm, fieldToUpdate}) => {
    try {
      const updatedWordProperties = await updateWordAPI({
        wordId,
        fieldToUpdate,
        language,
      });

      const targetLanguageWordsStateUpdated = targetLanguageWordsState.map(
        item => {
          const thisWordId = item.id === wordId;
          if (thisWordId) {
            return {
              ...item,
              ...updatedWordProperties,
            };
          }
          return item;
        },
      );
      dispatch(setWordsStateDispatch(targetLanguageWordsStateUpdated));
      await storeDataLocalStorage(
        dataStorageKeyPrefix + words,
        targetLanguageWordsStateUpdated,
      );
      setUpdatePromptState(`${wordBaseForm} updated!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
      return true;
    } catch (error) {
      console.log('## updateWordData', {error});
    }
  };

  const deleteWord = async ({wordId, wordBaseForm}) => {
    try {
      await deleteWordAPI({wordId, language});
      const targetLanguageWordsStateUpdated = targetLanguageWordsState.filter(
        item => item.id !== wordId,
      );
      dispatch(setWordsStateDispatch(targetLanguageWordsStateUpdated));
      await storeDataLocalStorage(
        dataStorageKeyPrefix + words,
        targetLanguageWordsStateUpdated,
      );
      setUpdatePromptState(`${wordBaseForm} deleted!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
    } catch (error) {
      setUpdatePromptState(`Error deleting ${wordBaseForm} 😟!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
      console.log('## deleteWord', {error});
    }
  };

  const removeSnippet = async ({snippetId}) => {
    try {
      const deletedSnippetId = await deleteSnippetAPI({snippetId, language});
      const updatedSnippets = targetLanguageSnippetsState.filter(
        item => item.id !== deletedSnippetId,
      );
      dispatch(setSnippetsStateDispatch(updatedSnippets));
      await storeDataLocalStorage(
        dataStorageKeyPrefix + snippets,
        updatedSnippets,
      );
      return deletedSnippetId;
    } catch (error) {
      console.log('## error removeSnippet (DataProvider.tsx)');
      updatePromptFunc('Error removing snippet', 2000);
    }
  };

  const saveWordFirebase = async ({
    highlightedWord,
    highlightedWordSentenceId,
    contextSentence,
    isGoogle,
  }) => {
    try {
      const savedWord = await saveWordAPI({
        highlightedWord,
        highlightedWordSentenceId,
        contextSentence,
        isGoogle,
        language,
      });
      const newWordsState = [...targetLanguageWordsState, savedWord];
      dispatch(setWordsStateDispatch(newWordsState));
      await storeDataLocalStorage(dataStorageKeyPrefix + words, newWordsState);
    } catch (error) {
      console.log('## saveWordFirebase Provider err', error);
      updatePromptFunc(`Error saving ${highlightedWord}`, 2000);
    }
  };

  const getThisSentencesWordList = sentence => {
    let matchedWordsData = [];
    targetLanguageWordsState.forEach(word => {
      if (!word) {
        // quick fix
        return;
      }
      const baseForm = word.baseForm;
      const surfaceForm = word.surfaceForm;
      if (sentence.includes(baseForm)) {
        matchedWordsData.push({...word, index: sentence.indexOf(baseForm)});

        return;
      }

      if (sentence.includes(surfaceForm)) {
        matchedWordsData.push({...word, index: sentence.indexOf(surfaceForm)});
        return;
      }
    });

    return matchedWordsData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allStudyDataRes = await getAllData({language, freshData: false});
        const targetLanguageLoadedSentences = allStudyDataRes.sentences;
        const targetLanguageLoadedContent = allStudyDataRes.content;
        const targetLanguageLoadedSnippets = allStudyDataRes.snippets;
        const targetLanguageLoadedWords = allStudyDataRes.words;
        const targetLanguageLoadedSnippetsWithSavedTag =
          targetLanguageLoadedSnippets?.map(item => ({
            ...item,
            saved: true,
          }));
        dispatch(
          setSnippetsStateDispatch(targetLanguageLoadedSnippetsWithSavedTag),
        );
        const sortedContent = targetLanguageLoadedContent
          ?.sort((a, b) => {
            return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
          })
          .map((contentWidget, contentIndex) => ({
            ...contentWidget,
            contentIndex: contentIndex,
          }));
        dispatch(setLearningContentStateDispatch(sortedContent));
        dispatch(setWordsStateDispatch(targetLanguageLoadedWords));
        dispatch(setSentencesStateDispatch(targetLanguageLoadedSentences));
      } catch (error) {
        console.log('## DataProvider error: ', error);
        setProvdiderError(error);
      } finally {
        setDataProviderIsLoading(false);
      }
    };
    if (language) {
      fetchData();
    }
  }, [language]);

  return (
    <DataContext.Provider
      value={{
        dataProviderIsLoading,
        provdiderError,
        updateSentenceData,
        updatePromptState,
        addAdhocSentenceFunc,
        isAdhocDataLoading,
        addSnippet,
        removeSnippet,
        pureWords: pureWordsArr,
        saveWordFirebase,
        getThisSentencesWordList,
        updatingSentenceState,
        structuredUnifiedData,
        setStructuredUnifiedData,
        updateContentMetaData,
        updateSentenceViaContent,
        bulkAddReviews,
        sentenceReviewBulk,
        combineWordsListState,
        combineWords,
        loadingCombineSentences,
        setCombineWordsListState,
        addSentenceContext,
        getSentenceAudio,
        deleteWord,
        updateWordData,
        updateMetaDataState,
      }}>
      {children}
    </DataContext.Provider>
  );
};
