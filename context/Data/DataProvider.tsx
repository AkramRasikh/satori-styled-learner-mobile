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
  const [dataProviderIsLoading, setDataProviderIsLoading] = useState(true);
  const [provdiderError, setProvdiderError] = useState(null);

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
      await updateSentenceDataAPI({
        topicName,
        sentenceId,
        fieldToUpdate,
      });
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
      }}>
      {children}
    </DataContext.Provider>
  );
};
