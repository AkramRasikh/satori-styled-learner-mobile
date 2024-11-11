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
import useLanguageSelector from './useLanguageSelector';

export const DataContext = createContext(null);

export const DataProvider = ({children}: PropsWithChildren<{}>) => {
  const [audioTempState, setAudioTempState] = useState({});
  const [homeScreenData, setHomeScreenData] = useState(null);
  const [updatingSentenceState, setUpdatingSentenceState] = useState('');
  const [
    targetLanguageLoadedContentMaster,
    settargetLanguageLoadedContentMaster,
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

  const saveAudioInstance = (audioId, soundInstance) => {
    const isInAudioTempState = audioTempState[audioId];
    if (!isInAudioTempState) {
      setAudioTempState(prevState => ({
        ...prevState,
        [audioId]: soundInstance,
      }));
    }
  };

  const updateLoadedContentStateAfterSentenceUpdate = ({
    sentenceId,
    topicName,
    resObj,
  }) => {
    const thisTopicDataIndex = targetLanguageLoadedContentMaster.findIndex(
      topic => topic.title === topicName,
    );

    const thisTopicData = targetLanguageLoadedContentMaster[thisTopicDataIndex];

    const thisTopicUpdateContent = thisTopicData.content.map(sentenceData => {
      if (sentenceData.id === sentenceId) {
        return {
          ...sentenceData,
          ...resObj,
        };
      }
      return sentenceData;
    });

    const newTopicState = {
      ...thisTopicData,
      content: thisTopicUpdateContent,
    };

    const filteredTopics = targetLanguageLoadedContentMaster.map(topic => {
      if (topic.title !== topicName) {
        return topic;
      }
      return newTopicState;
    });

    settargetLanguageLoadedContentMaster(filteredTopics);
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
      setUpdatePromptState('Error saving updating adhoc sentence');
      setTimeout(() => setUpdatePromptState(''), 2000);
    }
  };

  const updateSentenceData = async ({
    topicName,
    sentenceId,
    fieldToUpdate,
    isAdhoc,
  }) => {
    const updateBackEnd = async () => {
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

      return resObj;
    };

    try {
      setUpdatingSentenceState(sentenceId);
      const resObj = await updateBackEnd();
      if (!isAdhoc) {
        updateLoadedContentStateAfterSentenceUpdate({
          topicName,
          sentenceId,
          resObj,
        });
      }
      setUpdatePromptState(`${topicName} updated!`);
      setTimeout(() => setUpdatePromptState(''), 2000);
      return resObj;
    } catch (error) {
      console.log('## updateSentenceData', {error});
      setUpdatePromptState(`Error updating sentence for ${topicName}`);
      setTimeout(() => setUpdatePromptState(''), 2000);
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
      setAdhocTargetLanguageSentencesState(prev => [...prev, adhocObject]);
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
      setTargetLanguageSnippetsState(prev => [
        ...prev,
        {...snippetDataFromAPI, saved: true},
      ]);
      return snippetDataFromAPI;
    } catch (error) {
      console.log('## error adding snippet (DataProvider.tsx)');
      setUpdatePromptState('Error adding snippet');
      setTimeout(() => setUpdatePromptState(''), 2000);
    }
  };

  const removeSnippet = async ({snippetId}) => {
    try {
      const deletedSnippetId = await deleteSnippetAPI({snippetId, language});
      const updatedSnippets = targetLanguageSnippetsState.filter(
        item => item.id !== deletedSnippetId,
      );
      setTargetLanguageSnippetsState(updatedSnippets);
      return deletedSnippetId;
    } catch (error) {
      console.log('## error removeSnippet (DataProvider.tsx)');
      setUpdatePromptState('Error removing snippet');
      setTimeout(() => setUpdatePromptState(''), 2000);
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
      setTargetLanguageWordsState(prev => [...prev, savedWord]);
    } catch (error) {
      console.log('## saveWordFirebase Provider err', error);
      setUpdatePromptState(`Error saving ${highlightedWord}`);
      setTimeout(() => setUpdatePromptState(''), 2000);
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
        const allStudyDataRes = await getAllData({language});
        const targetLanguageLoadedSentences =
          allStudyDataRes.targetLanguageLoadedSentences;
        const targetLanguageLoadedContent =
          allStudyDataRes.targetLanguageLoadedContent;
        const targetLanguageLoadedSnippets =
          allStudyDataRes.targetLanguageLoadedSnippets;
        const targetLanguageLoadedSnippetsWithSavedTag =
          targetLanguageLoadedSnippets?.map(item => ({
            ...item,
            saved: true,
          }));
        setHomeScreenData(allStudyDataRes);
        setTargetLanguageSnippetsState(
          targetLanguageLoadedSnippetsWithSavedTag,
        );
        settargetLanguageLoadedContentMaster(
          targetLanguageLoadedContent?.sort((a, b) => {
            return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
          }),
        );
        setTargetLanguageWordsState(allStudyDataRes.targetLanguageLoadedWords);
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
        homeScreenData,
        saveAudioInstance,
        audioTempState,
        updateSentenceData,
        updatePromptState,
        targetLanguageLoadedContentMaster,
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
      }}>
      {children}
    </DataContext.Provider>
  );
};
