import React from 'react';
import {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {loadDifficultSentences} from '../../api/load-difficult-sentences';
import {getAllData} from '../../api/load-content';

export const DataContext = createContext(null);

export const DataProvider = ({children}: PropsWithChildren<{}>) => {
  const [difficultSentencesState, setDifficultSentencesState] = useState([]);
  const [homeScreenData, setHomeScreenData] = useState(null);
  const [dataProviderIsLoading, setDataProviderIsLoading] = useState(true);
  const [provdiderError, setProvdiderError] = useState(null);

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
      }}>
      {children}
    </DataContext.Provider>
  );
};
