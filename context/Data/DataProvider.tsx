import React from 'react';
import {createContext, PropsWithChildren, useEffect, useState} from 'react';
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

export const DataContext = createContext(null);

export const DataProvider = ({children}: PropsWithChildren<{}>) => {
  const [updatingSentenceState, setUpdatingSentenceState] = useState('');
  const [
    targetLanguageLoadedContentMasterState,
    setTargetLanguageLoadedContentMasterState,
  ] = useState([]);
  const [targetLanguageSnippetsState, setTargetLanguageSnippetsState] =
    useState([]);
  const [
    adhocTargetLanguageSentencesState,
    setAdhocTargetLanguageSentencesState,
  ] = useState([]);
  const [targetLanguageWordsState, setTargetLanguageWordsState] = useState([]);
  const [dataProviderIsLoading, setDataProviderIsLoading] = useState(true);
  const [provdiderError, setProvdiderError] = useState(null);
  const [updatePromptState, setUpdatePromptState] = useState('');
  const [isAdhocDataLoading, setIsAdhocDataLoading] = useState(false);
  const [structuredUnifiedData, setStructuredUnifiedData] = useState([]);

  const {languageSelectedState: language} = useLanguageSelector();
  const dataStorageKeyPrefix = `${language}-data-`;

  const getPureWords = () => {
    let pureWords = [];

    targetLanguageWordsState?.forEach(wordData => {
      pureWords.push(wordData.baseForm);
      pureWords.push(wordData.surfaceForm);
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

    setTargetLanguageLoadedContentMasterState(updatedState);
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
        setTargetLanguageLoadedContentMasterState(updatedState);
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

  const sentenceReviewBulk = async ({
    fieldToUpdate,
    topicName,
    contentIndex,
  }) => {
    try {
      const updatedContentRes = await sentenceReviewBulkAPI({
        title: topicName,
        fieldToUpdate,
        language,
      });

      if (updatedContentRes) {
        const updatedState = [...targetLanguageLoadedContentMasterState];
        const thisTopicData = updatedState[contentIndex];
        const newTopicState = {...thisTopicData, ...updatedContentRes};
        updatedState[contentIndex] = {
          ...newTopicState,
        };
        setTargetLanguageLoadedContentMasterState(updatedState);
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
      setAdhocTargetLanguageSentencesState(updatedAdhocSentencesState);
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
      setTargetLanguageSnippetsState(updatedSnippets);
      await storeDataLocalStorage(
        dataStorageKeyPrefix + snippets,
        updatedSnippets,
      );
      return snippetDataFromAPI;
    } catch (error) {
      updatePromptFunc('❌☠️ Error adding snippet', 2000);
    }
  };

  const removeSnippet = async ({snippetId}) => {
    try {
      const deletedSnippetId = await deleteSnippetAPI({snippetId, language});
      const updatedSnippets = targetLanguageSnippetsState.filter(
        item => item.id !== deletedSnippetId,
      );
      setTargetLanguageSnippetsState(updatedSnippets);
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
      setTargetLanguageWordsState(newWordsState);
      await storeDataLocalStorage(dataStorageKeyPrefix + words, newWordsState);
    } catch (error) {
      console.log('## saveWordFirebase Provider err', error);
      updatePromptFunc(`Error saving ${highlightedWord}`, 2000);
    }
  };

  const getThisSentencesWordList = sentence => {
    let matchedWordsData = [];
    targetLanguageWordsState.forEach(word => {
      const baseForm = word.baseForm;
      const surfaceForm = word.surfaceForm;
      if (sentence.includes(baseForm)) {
        matchedWordsData.push(word);

        return;
      }

      if (sentence.includes(surfaceForm)) {
        matchedWordsData.push(word);
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
        setTargetLanguageSnippetsState(
          targetLanguageLoadedSnippetsWithSavedTag,
        );
        setTargetLanguageLoadedContentMasterState(
          targetLanguageLoadedContent
            ?.sort((a, b) => {
              return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
            })
            .map((contentWidget, contentIndex) => ({
              ...contentWidget,
              contentIndex: contentIndex,
            })),
        );
        setTargetLanguageWordsState(targetLanguageLoadedWords);
        setAdhocTargetLanguageSentencesState(targetLanguageLoadedSentences);
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
        targetLanguageSnippetsState,
        addSnippet,
        removeSnippet,
        targetLanguageWordsState,
        pureWords: pureWordsArr,
        saveWordFirebase,
        getThisSentencesWordList,
        adhocTargetLanguageSentencesState,
        updatingSentenceState,
        setTargetLanguageWordsState,
        structuredUnifiedData,
        setStructuredUnifiedData,
        targetLanguageLoadedContentMasterState,
        setTargetLanguageLoadedContentMasterState,
        updateContentMetaData,
        updateSentenceViaContent,
        bulkAddReviews,
        sentenceReviewBulk,
      }}>
      {children}
    </DataContext.Provider>
  );
};
