import React from 'react';
import {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {getAllData} from '../../api/load-content';
import {updateSentenceDataAPI} from '../../api/update-sentence-data';
import addAdhocSentenceAPI from '../../api/add-adhoc-sentence';
import {setFutureReviewDate} from '../../components/ReviewSection';
import updateAdhocSentenceAPI from '../../api/update-adhoc-sentence';
import {addSnippetAPI, deleteSnippetAPI} from '../../api/snippet';
import {sortByDueDate} from '../../utils/sort-by-due-date';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import saveWordAPI from '../../api/save-word';
import {updateWordAPI} from '../../api/update-word-data';
import {deleteWordAPI} from '../../api/delete-word';
import useLanguageSelector from './useLanguageSelector';

export const DataContext = createContext(null);

export const DataProvider = ({children}: PropsWithChildren<{}>) => {
  const [difficultSentencesState, setDifficultSentencesState] = useState([]);
  const [audioTempState, setAudioTempState] = useState({});
  const [homeScreenData, setHomeScreenData] = useState(null);
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

  const {languageSelectedState: language} = useLanguageSelector();

  const getPureWords = () => {
    let pureWords = [];
    const targetLanguageLoadedWords = [
      ...targetLanguageWordsState,
      // ...newWordsAdded,
    ];

    targetLanguageLoadedWords?.forEach(wordData => {
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

  const getSentencesMarkedAsDifficult = (
    dataFromJapaneseContent,
    adhocSentences,
  ) => {
    const difficultSentences = [];
    dataFromJapaneseContent?.forEach(contentWidget => {
      const thisTopic = contentWidget.title;
      const isCore = contentWidget.isCore;
      const isMediaContent =
        contentWidget.origin === 'netflix' ||
        contentWidget.origin === 'youtube';
      const content = contentWidget.content;
      content.forEach(sentenceInContent => {
        if (
          sentenceInContent?.nextReview ||
          sentenceInContent?.reviewData?.due
        ) {
          difficultSentences.push({
            topic: thisTopic,
            isCore,
            isMediaContent,
            ...sentenceInContent,
          });
        }
      });
    });

    adhocSentences.forEach(contentWidget => {
      const thisTopic = contentWidget.topic;
      const isCore = contentWidget?.isCore;
      const nextReview = contentWidget?.nextReview;
      if (nextReview || contentWidget?.reviewData?.due) {
        difficultSentences.push({
          topic: thisTopic,
          isCore,
          isAdhoc: true,
          ...contentWidget,
        });
      }
    });
    return difficultSentences;
  };

  const filterDifficultSentenceOut = sentenceIdToRemove =>
    difficultSentencesState.filter(
      sentence => sentence.id !== sentenceIdToRemove,
    );

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
      console.log('## handleUpdateAdhocSentenceDifficult ', error);
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
      setTargetLanguageWordsState(targetLanguageWordsStateUpdated);
      setUpdatePromptState(`${wordBaseForm} updated!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
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
      setTargetLanguageWordsState(targetLanguageWordsStateUpdated);
      setUpdatePromptState(`${wordBaseForm} deleted!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
    } catch (error) {
      setUpdatePromptState(`Error deleting ${wordBaseForm} 😟!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
      console.log('## deleteWord', {error});
    }
  };

  const updateSentenceData = async ({
    topicName,
    sentenceId,
    fieldToUpdate,
    isAdhoc,
  }) => {
    const isRemoveFromDifficultSentences =
      !isAdhoc && fieldToUpdate?.nextReview === null;
    try {
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

      const updatedSentences = isRemoveFromDifficultSentences
        ? filterDifficultSentenceOut(sentenceId)
        : difficultSentencesState.map(item => {
            if (item.id === sentenceId) {
              return {
                ...item,
                ...resObj,
              };
            }

            return item;
          });

      if (!isAdhoc) {
        updateLoadedContentStateAfterSentenceUpdate({topicName, sentenceId});
      }

      setDifficultSentencesState(updatedSentences);
      setUpdatePromptState(`${topicName} updated!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
    } catch (error) {
      console.log('## updateSentenceData', {error});
    }
  };

  const addAdhocSentenceFunc = async ({baseLang, context, topic, tags}) => {
    try {
      const adhocObject = await addAdhocSentenceAPI({
        baseLang,
        context,
        topic,
        tags,
        nextReview: setFutureReviewDate(new Date(), 3),
      });
      setIsAdhocDataLoading(true);
      // need to update difficult sentences
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

      const thisSnippetsSentence = snippetDataFromAPI.sentenceId;
      const isInDiffSentenceArr = difficultSentencesState.some(
        diffSentence => diffSentence.id === thisSnippetsSentence,
      );
      if (isInDiffSentenceArr) {
        const updatedDifficultSentencesWithSnippet =
          difficultSentencesState.map(diffSentence => {
            if (diffSentence.id === thisSnippetsSentence) {
              const hasSnippets = diffSentence?.snippets?.length > 0;
              return {
                ...diffSentence,
                snippets: hasSnippets
                  ? [
                      ...diffSentence.snippets,
                      {...snippetDataFromAPI, saved: true},
                    ]
                  : [{...snippetDataFromAPI, saved: true}],
              };
            }
            return diffSentence;
          });
        setDifficultSentencesState(updatedDifficultSentencesWithSnippet);
      }

      return snippetDataFromAPI;
    } catch (error) {
      console.log('## error adding snippet (DataProvider.tsx)');
    }
  };

  const removeSnippet = async ({snippetId, sentenceId}) => {
    try {
      const deletedSnippetId = await deleteSnippetAPI({snippetId, language});
      const updatedSnippets = targetLanguageSnippetsState.filter(
        item => item.id !== deletedSnippetId,
      );
      setTargetLanguageSnippetsState(updatedSnippets);

      const isInDiffSentenceArr = difficultSentencesState.some(
        diffSentence => diffSentence.id === sentenceId,
      );
      if (isInDiffSentenceArr) {
        const updatedDifficultSentencesWithSnippet =
          difficultSentencesState.map(diffSentence => {
            if (diffSentence.id === sentenceId) {
              const hasSnippets = diffSentence?.snippets?.length > 0;
              return {
                ...diffSentence,
                snippets: hasSnippets
                  ? diffSentence.snippets.filter(
                      nestedSnippet => nestedSnippet.id !== deletedSnippetId,
                    )
                  : [],
              };
            }
            return diffSentence;
          });
        setDifficultSentencesState(updatedDifficultSentencesWithSnippet);
      }
    } catch (error) {
      console.log('## error removeSnippet (DataProvider.tsx)');
    }
  };

  const addSnippetsToDifficultSentences = (
    allInitDifficultSentences,
    targetLanguageLoadedSnippetsWithSavedTag,
  ) => {
    return allInitDifficultSentences.map(sentenceData => {
      return {
        ...sentenceData,
        snippets: targetLanguageLoadedSnippetsWithSavedTag.filter(
          snippetData => snippetData.sentenceId === sentenceData.id,
        ),
      };
    });
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
          allStudyDataRes.targetLanguageLoadedContent?.sort((a, b) => {
            return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
          }),
        );

        const allInitDifficultSentences = getSentencesMarkedAsDifficult(
          allStudyDataRes.targetLanguageLoadedContent,
          targetLanguageLoadedSentences,
        )?.sort(sortByDueDate);
        const difficultSentencesWithSnippets = addSnippetsToDifficultSentences(
          allInitDifficultSentences,
          targetLanguageLoadedSnippetsWithSavedTag,
        );
        setDifficultSentencesState(difficultSentencesWithSnippets);
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
        difficultSentencesState,
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
        updateWordData,
        deleteWord,
      }}>
      {children}
    </DataContext.Provider>
  );
};
