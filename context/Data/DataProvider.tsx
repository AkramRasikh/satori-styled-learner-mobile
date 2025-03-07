import React from 'react';
import {createContext, PropsWithChildren, useState} from 'react';
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
import {
  setLearningContentStateDispatch,
  updateSentenceAndReturnState,
  updateSentenceRemoveReviewAndReturnState,
} from '../../store/contentSlice';
import {setWordsStateDispatch} from '../../store/wordSlice';
import {setSentencesStateDispatch} from '../../store/sentencesSlice';
import {setSnippetsStateDispatch} from '../../store/snippetsSlice';
import {deleteWordAPI} from '../../api/delete-word';
import {updateWordAPI} from '../../api/update-word-data';
import {breakdownSentenceAPI} from '../../api/breakdown-sentence';
import {
  getEmptyCard,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../srs-algo';

export const DataContext = createContext(null);

export const DataProvider = ({children}: PropsWithChildren<{}>) => {
  const [updatingSentenceState, setUpdatingSentenceState] = useState('');
  const [dataProviderIsLoading, setDataProviderIsLoading] = useState(true);
  const [provdiderError, setProvdiderError] = useState(null);
  const [updatePromptState, setUpdatePromptState] = useState('');
  const [isAdhocDataLoading, setIsAdhocDataLoading] = useState(true);
  const [combineWordsListState, setCombineWordsListState] = useState([]);
  const [updateMetaDataState, setUpdateMetaDataState] = useState(0);
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

  const updatePromptFunc = promptText => {
    setUpdatePromptState(promptText);
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
        updatePromptFunc(`${topicName} updated!`);
        return newTopicState;
      }
    } catch (error) {
      updatePromptFunc(`Error updating ${topicName}!`);
    }
  };

  const combineWords = async ({inputWords}) => {
    try {
      const combineWordsSentencesRes = await combineWordsAPI({
        inputWords,
        language,
      });
      console.log('## combineWordsSentencesRes', combineWordsSentencesRes);
      const updatedAdhocSentencesState = [
        ...adhocTargetLanguageSentencesState,
        combineWordsSentencesRes,
      ];
      dispatch(setSentencesStateDispatch(updatedAdhocSentencesState));
      updatePromptFunc(`Added ${combineWordsSentencesRes.length} sentences!`);
    } catch (error) {
      updatePromptFunc('Error combining words');
    } finally {
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
        updatePromptFunc(`${topicName} updated!`);
        return newTopicState;
      }
    } catch (error) {
      updatePromptFunc(`Error updating ${topicName}!`);
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
      updatePromptFunc('Error saving updating adhoc sentence');
    }
  };

  const breakdownSentence = async ({
    topicName,
    sentenceId,
    language,
    targetLang,
    contentIndex,
  }) => {
    try {
      setUpdatingSentenceState(sentenceId);
      const resObj = await breakdownSentenceAPI({
        topicName,
        sentenceId,
        targetLang,
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

      updatePromptFunc(`${topicName} updated!`);
      return updatedContentState[contentIndex];
    } catch (error) {
      console.log('## breakdownSentence', {error});
      updatePromptFunc(`Error updating sentence for ${topicName}`);
    } finally {
      setUpdatingSentenceState('');
    }
  };

  const updateSentenceData = async ({
    topicName,
    sentenceId,
    fieldToUpdate,
    isAdhoc,
    contentIndex,
    isRemoveReview,
  }) => {
    try {
      setUpdatingSentenceState(sentenceId);
      const updatedFieldFromDB = isAdhoc
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
        if (isRemoveReview) {
          const updatedContentState = dispatch(
            updateSentenceRemoveReviewAndReturnState({
              sentenceId,
              contentIndex,
            }),
          ).learningContent;

          await storeDataLocalStorage(
            dataStorageKeyPrefix + content,
            updatedContentState,
          );
        } else {
          const updatedContentState = dispatch(
            updateSentenceAndReturnState({
              sentenceId,
              fieldToUpdate: updatedFieldFromDB,
              contentIndex,
            }),
          ).learningContent;

          await storeDataLocalStorage(
            dataStorageKeyPrefix + content,
            updatedContentState,
          );
        }
      }
      updatePromptFunc(`${topicName} updated!`);
      return updatedFieldFromDB;
    } catch (error) {
      console.log('## updateSentenceData', {error});
      updatePromptFunc(`Error updating sentence for ${topicName}`);
    } finally {
      setUpdatingSentenceState('');
    }
  };

  const getSentenceAudio = async ({id, sentence}) => {
    try {
      const res = await addSentenceAudioAPI({language, id, sentence});
      return res;
    } catch (error) {
      updatePromptFunc(`Error getting audio for  ${sentence}`);
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
      updatePromptFunc('Error adding context data');
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
      updatePromptFunc(`${topicName} updated!`);
      return updatedContentState[contentIndex];
    } catch (error) {
      console.log('## updateSentenceViaContent', {error});
      updatePromptFunc(`Error updating sentence for ${topicName}`);
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
      updatePromptFunc('❌☠️ Error adding snippet');
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
      console.log('## updateWordData DataProvider', {error});
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
      updatePromptFunc('Error removing snippet');
    }
  };

  const saveWordFirebase = async ({
    highlightedWord,
    highlightedWordSentenceId,
    contextSentence,
    isGoogle,
  }) => {
    try {
      const cardDataRelativeToNow = getEmptyCard();
      const nextScheduledOptions = getNextScheduledOptions({
        card: cardDataRelativeToNow,
        contentType: srsRetentionKeyTypes.vocab,
      });

      const savedWord = await saveWordAPI({
        highlightedWord,
        highlightedWordSentenceId,
        contextSentence,
        isGoogle,
        language,
        reviewData: nextScheduledOptions['1'].card,
      });
      const newWordsState = [...targetLanguageWordsState, savedWord];
      dispatch(setWordsStateDispatch(newWordsState));
      await storeDataLocalStorage(dataStorageKeyPrefix + words, newWordsState);
      return savedWord;
    } catch (error) {
      console.log('## saveWordFirebase Provider err', error);
      updatePromptFunc(`Error saving ${highlightedWord}`);
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
        const indexOfBaseForm = sentence.indexOf(baseForm);
        matchedWordsData.push({
          ...word,
          indexStart: indexOfBaseForm,
          indexEnd: indexOfBaseForm + baseForm.length,
        });

        return;
      }

      if (sentence.includes(surfaceForm)) {
        const indexOfSurfaceForm = sentence.indexOf(surfaceForm);

        matchedWordsData.push({
          ...word,
          indexStart: indexOfSurfaceForm,
          indexEnd: indexOfSurfaceForm + surfaceForm.length,
        });
        return;
      }
    });

    return matchedWordsData;
  };
  const fetchData = async selectedLanguage => {
    try {
      const allStudyDataRes = await getAllData({
        language: selectedLanguage,
        freshData: false,
      });
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

  return (
    <DataContext.Provider
      value={{
        dataProviderIsLoading,
        provdiderError,
        updateSentenceData,
        addAdhocSentenceFunc,
        isAdhocDataLoading,
        addSnippet,
        removeSnippet,
        pureWords: pureWordsArr,
        saveWordFirebase,
        getThisSentencesWordList,
        updatingSentenceState,
        updateContentMetaData,
        updateSentenceViaContent,
        bulkAddReviews,
        sentenceReviewBulk,
        combineWordsListState,
        combineWords,
        setCombineWordsListState,
        addSentenceContext,
        getSentenceAudio,
        deleteWord,
        updateWordData,
        updateMetaDataState,
        breakdownSentence,
        fetchData,
        setUpdatePromptState,
        updatePromptState,
      }}>
      {children}
    </DataContext.Provider>
  );
};
