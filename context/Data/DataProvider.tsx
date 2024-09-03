import React from 'react';
import {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {getAllData} from '../../api/load-content';
import {updateSentenceDataAPI} from '../../api/update-sentence-data';
import addAdhocSentenceAPI from '../../api/add-adhoc-sentence';
import {setFutureReviewDate} from '../../components/ReviewSection';
import updateAdhocSentenceAPI from '../../api/update-adhoc-sentence';
import {addSnippetAPI, deleteSnippetAPI} from '../../api/snippet';
import {sortByDueDate} from '../../utils/sort-by-due-date';

export const DataContext = createContext(null);

export const DataProvider = ({children}: PropsWithChildren<{}>) => {
  const [difficultSentencesState, setDifficultSentencesState] = useState([]);
  const [audioTempState, setAudioTempState] = useState({});
  const [homeScreenData, setHomeScreenData] = useState(null);
  const [japaneseLoadedContentMaster, setJapaneseLoadedContentMaster] =
    useState([]);
  const [japaneseSnippetsState, setJapaneseSnippetsState] = useState([]);
  const [dataProviderIsLoading, setDataProviderIsLoading] = useState(true);
  const [provdiderError, setProvdiderError] = useState(null);
  const [updatePromptState, setUpdatePromptState] = useState('');
  const [isAdhocDataLoading, setIsAdhocDataLoading] = useState(false);

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
    dataFromJapaneseContent.forEach(contentWidget => {
      const thisTopic = contentWidget.title;
      const isCore = contentWidget.isCore;
      const content = contentWidget.content;
      content.forEach(sentenceInContent => {
        if (sentenceInContent?.nextReview) {
          difficultSentences.push({
            topic: thisTopic,
            isCore,
            ...sentenceInContent,
          });
        }
      });
    });

    adhocSentences.forEach(contentWidget => {
      const thisTopic = contentWidget.topic;
      const isCore = contentWidget?.isCore;
      const nextReview = contentWidget?.nextReview;
      if (nextReview) {
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
    const thisTopicDataIndex = japaneseLoadedContentMaster.findIndex(
      topic => topic.title === topicName,
    );

    const thisTopicData = japaneseLoadedContentMaster[thisTopicDataIndex];

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

    const filteredTopics = japaneseLoadedContentMaster.map(topic => {
      if (topic.title !== topicName) {
        return topic;
      }
      return newTopicState;
    });

    setJapaneseLoadedContentMaster(filteredTopics);
  };

  const handleUpdateAdhocSentenceDifficult = async ({
    sentenceId,
    fieldToUpdate,
  }) => {
    try {
      const res = await updateAdhocSentenceAPI({sentenceId, fieldToUpdate});
      return {
        isAdhoc: true,
        ...res,
      };
    } catch (error) {
      console.log('## handleUpdateAdhocSentenceDifficult ', error);
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
        ? await handleUpdateAdhocSentenceDifficult({sentenceId, fieldToUpdate})
        : await updateSentenceDataAPI({
            topicName,
            sentenceId,
            fieldToUpdate,
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
      });
      setJapaneseSnippetsState(prev => [
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
      const deletedSnippetId = await deleteSnippetAPI({snippetId});
      const updatedSnippets = japaneseSnippetsState.filter(
        item => item.id !== deletedSnippetId,
      );
      setJapaneseSnippetsState(updatedSnippets);

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
    japaneseLoadedSnippetsWithSavedTag,
  ) => {
    return allInitDifficultSentences.map(sentenceData => {
      return {
        ...sentenceData,
        snippets: japaneseLoadedSnippetsWithSavedTag.filter(
          snippetData => snippetData.sentenceId === sentenceData.id,
        ),
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allStudyDataRes = await getAllData();
        const japaneseAdhocLoadedSentences =
          allStudyDataRes.japaneseAdhocLoadedSentences;
        const japaneseLoadedSnippets = allStudyDataRes.japaneseLoadedSnippets;
        const japaneseLoadedSnippetsWithSavedTag = japaneseLoadedSnippets?.map(
          item => ({
            ...item,
            saved: true,
          }),
        );
        setHomeScreenData(allStudyDataRes);
        setJapaneseSnippetsState(japaneseLoadedSnippetsWithSavedTag);
        setJapaneseLoadedContentMaster(
          allStudyDataRes.japaneseLoadedContent.sort((a, b) => {
            return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
          }),
        );

        const allInitDifficultSentences = getSentencesMarkedAsDifficult(
          allStudyDataRes.japaneseLoadedContent,
          japaneseAdhocLoadedSentences,
        ).sort(sortByDueDate);
        const difficultSentencesWithSnippets = addSnippetsToDifficultSentences(
          allInitDifficultSentences,
          japaneseLoadedSnippetsWithSavedTag,
        );
        setDifficultSentencesState(difficultSentencesWithSnippets);
      } catch (error) {
        console.log('## DataProvider error: ', error);
        setProvdiderError(error);
      } finally {
        setDataProviderIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
        japaneseLoadedContentMaster,
        addAdhocSentenceFunc,
        isAdhocDataLoading,
        japaneseSnippetsState,
        addSnippet,
        removeSnippet,
      }}>
      {children}
    </DataContext.Provider>
  );
};
