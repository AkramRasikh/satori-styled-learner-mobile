import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import useLoadDifficultSentences from '../../hooks/useLoadDifficultSentences';
import useData from '../Data/useData';

export const DifficultSentencesContext = createContext(null);

export const DifficultSentencesProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [difficultSentencesState, setDifficultSentencesState] = useState([]);
  const [
    difficultSentencesHasBeenSetState,
    setDifficultSentencesHasBeenSetState,
  ] = useState(false);

  const {adhocTargetLanguageSentencesState} = useData();

  const {getAllDataReady} = useLoadDifficultSentences({
    adhocTargetLanguageSentencesState,
  });

  const removeDifficultSentenceFromState = sentenceId => {
    const updatedDifficultSentences = difficultSentencesState.filter(
      sentenceData => sentenceData.id !== sentenceId,
    );
    setDifficultSentencesState(updatedDifficultSentences);
  };

  const updateDifficultSentence = ({sentenceId, updateDataRes}) => {
    const updatedState = difficultSentencesState.map(sentenceData => {
      if (sentenceData.id === sentenceId) {
        return {
          ...sentenceData,
          ...updateDataRes,
        };
      }
      return sentenceData;
    });
    setDifficultSentencesState(updatedState);
  };

  const addToSentenceToDifficultSentences = ({sentenceData}) => {
    setDifficultSentencesState(prev => [...prev, sentenceData]);
  };

  const refreshDifficultSentencesInfo = () => {
    const difficultSentencesData = getAllDataReady();
    setDifficultSentencesState(difficultSentencesData);
    setDifficultSentencesHasBeenSetState(true);
  };

  useEffect(() => {
    const difficultSentencesData = getAllDataReady();
    if (
      difficultSentencesData?.length > 0 &&
      !difficultSentencesHasBeenSetState
    ) {
      setDifficultSentencesState(difficultSentencesData);
      setDifficultSentencesHasBeenSetState(true);
    }
  }, [
    difficultSentencesHasBeenSetState,
    adhocTargetLanguageSentencesState,
    getAllDataReady,
  ]);

  return (
    <DifficultSentencesContext.Provider
      value={{
        difficultSentencesState,
        setDifficultSentencesState,
        removeDifficultSentenceFromState,
        updateDifficultSentence,
        addToSentenceToDifficultSentences,
        refreshDifficultSentencesInfo,
      }}>
      {children}
    </DifficultSentencesContext.Provider>
  );
};
