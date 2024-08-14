import React from 'react';
import {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {loadDifficultSentences} from '../../api/load-difficult-sentences';

export const DataContext = createContext(null);

export const DataProvider = ({children}: PropsWithChildren<{}>) => {
  const [difficultSentencesState, setDifficultSentencesState] = useState([]);
  const [dataProviderIsLoading, setDataProviderIsLoading] = useState(true);
  const [provdiderError, setProvdiderError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allDifficultSentencesRes = await loadDifficultSentences();
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
      }}>
      {children}
    </DataContext.Provider>
  );
};
