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
    //   {
    //     "adhocSentence": {
    //         "baseLang": "They say you should wait at least an hour after waking up before having a coffee. Your body naturally wakes itself up in this period and it is better not to interfere in this process",
    //         "context": "I read somewhere that its better to wait for your body to naturally wake up due to naturally increasing cortisol levels."
    //     },
    //     "topic": "coffee",
    //     "tags": ["coffee"],
    //     "nextReview": "new Date()"
    // }
  };

  const addSnippet = async snippetData => {
    try {
      const res = await addSnippetAPI({contentEntry: snippetData});
      setJapaneseSnippetsState(prev => [...prev, {...res, saved: true}]);
    } catch (error) {
      console.log('## error adding snippet (Home.tsx)');
    }
  };

  const removeSnippet = async snippetData => {
    try {
      const res = await deleteSnippetAPI({contentEntry: snippetData});
      const updatedSnippets = japaneseSnippetsState.filter(
        item => item.id !== res.id,
      );
      setJapaneseSnippetsState(updatedSnippets);
    } catch (error) {
      console.log('## error adding snippet (Home.tsx)');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allStudyDataRes = await getAllData();
        const japaneseAdhocLoadedSentences =
          allStudyDataRes.japaneseAdhocLoadedSentences;
        const japaneseLoadedSnippets = allStudyDataRes.japaneseLoadedSnippets;
        setHomeScreenData(allStudyDataRes);
        setJapaneseSnippetsState(
          japaneseLoadedSnippets?.map(item => ({
            ...item,
            saved: true,
          })),
        );
        setJapaneseLoadedContentMaster(
          allStudyDataRes.japaneseLoadedContent.sort((a, b) => {
            return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
          }),
        );

        const allInitDifficultSentences = getSentencesMarkedAsDifficult(
          allStudyDataRes.japaneseLoadedContent,
          japaneseAdhocLoadedSentences,
        ).sort(sortByDueDate);
        setDifficultSentencesState(allInitDifficultSentences);
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
