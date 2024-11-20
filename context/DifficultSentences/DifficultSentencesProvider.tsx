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

  const {
    adhocTargetLanguageSentencesState,
    targetLanguageLoadedContentMasterState,
  } = useData();

  const {getAllDataReady} = useLoadDifficultSentences({
    adhocTargetLanguageSentencesState,
    targetLanguageLoadedContentMasterState,
  });

  const removeDifficultSentenceFromState = sentenceId => {
    const updatedDifficultSentences = difficultSentencesState.filter(
      sentenceData => sentenceData.id !== sentenceId,
    );
    setDifficultSentencesState(updatedDifficultSentences);
  };

  const updateDifficultSentence = sentenceId => {
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
    targetLanguageLoadedContentMasterState,
    adhocTargetLanguageSentencesState,
    targetLanguageLoadedContentMasterState,
    getAllDataReady,
  ]);

  return (
    <DifficultSentencesContext.Provider
      value={{
        difficultSentencesState,
        setDifficultSentencesState,
        removeDifficultSentenceFromState,
        updateDifficultSentence,
      }}>
      {children}
    </DifficultSentencesContext.Provider>
  );
};
