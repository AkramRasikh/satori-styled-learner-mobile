import React from 'react';
import {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {loadDifficultSentences} from '../../api/load-difficult-sentences';
import {getAllData} from '../../api/load-content';
import {updateSentenceDataAPI} from '../../api/update-sentence-data';

export const DataContext = createContext(null);

export const DataProvider = ({children}: PropsWithChildren<{}>) => {
  const [difficultSentencesState, setDifficultSentencesState] = useState([]);
  const [audioTempState, setAudioTempState] = useState({});
  const [homeScreenData, setHomeScreenData] = useState(null);
  const [japaneseLoadedContentMaster, setJapaneseLoadedContentMaster] =
    useState([]);
  const [dataProviderIsLoading, setDataProviderIsLoading] = useState(true);
  const [provdiderError, setProvdiderError] = useState(null);
  const [updatePromptState, setUpdatePromptState] = useState('');

  const saveAudioInstance = (audioId, soundInstance) => {
    const isInAudioTempState = audioTempState[audioId];
    if (!isInAudioTempState) {
      setAudioTempState(prevState => ({
        ...prevState,
        [audioId]: soundInstance,
      }));
    }
  };

  const updateSentenceData = async ({topicName, sentenceId, fieldToUpdate}) => {
    try {
      const resObj = await updateSentenceDataAPI({
        topicName,
        sentenceId,
        fieldToUpdate,
      });

      const updatedSentences = difficultSentencesState.map(item => {
        if (item.id === sentenceId) {
          return {
            ...item,
            ...resObj,
          };
        }

        return item;
      });
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
      setDifficultSentencesState(updatedSentences);
      setUpdatePromptState(`${topicName} updated!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
    } catch (error) {
      console.log('## updateSentenceData', {error});
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allDifficultSentencesRes = await loadDifficultSentences();
        const allStudyDataRes = await getAllData();
        setHomeScreenData(allStudyDataRes);
        setJapaneseLoadedContentMaster(allStudyDataRes.japaneseLoadedContent);
        setDifficultSentencesState(allDifficultSentencesRes);
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
      }}>
      {children}
    </DataContext.Provider>
  );
};
