import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import useLoadDifficultSentences from '../../hooks/useLoadDifficultSentences';
import useLanguageSelector from '../LanguageSelector/useLanguageSelector';
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
  const [combineWordsListState, setCombineWordsListState] = useState([]);
  const [combineSentenceContext, setCombineSentenceContext] = useState('');

  const {combineWords} = useData();

  const handleCombineSentences = async () => {
    try {
      const combinedSentencesRes = await combineWords({
        inputWords: combineWordsListState,
        myCombinedSentence: combineSentenceContext,
      });
      setCombineSentenceContext('');
      setDifficultSentencesState(prev => [...prev, ...combinedSentencesRes]);
      setCombineWordsListState([]);
      refreshDifficultSentencesInfo(); // check if
    } catch (error) {
      console.log('## Error combining!', error);
    }
  };

  const {getAllDataReady} = useLoadDifficultSentences();

  const {languageSelectedState} = useLanguageSelector();

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
    if (languageSelectedState) {
      setDifficultSentencesHasBeenSetState(false);
    }
  }, [languageSelectedState]); // Is there a more efficient way??

  useEffect(() => {
    const difficultSentencesData = getAllDataReady();
    if (
      difficultSentencesData?.length > 0 &&
      !difficultSentencesHasBeenSetState
    ) {
      setDifficultSentencesState(difficultSentencesData);
      setDifficultSentencesHasBeenSetState(true);
    }
  }, [difficultSentencesHasBeenSetState, getAllDataReady]);

  return (
    <DifficultSentencesContext.Provider
      value={{
        difficultSentencesState,
        setDifficultSentencesState,
        removeDifficultSentenceFromState,
        updateDifficultSentence,
        addToSentenceToDifficultSentences,
        refreshDifficultSentencesInfo,
        handleCombineSentences,
        combineWordsListState,
        setCombineWordsListState,
        combineSentenceContext,
        setCombineSentenceContext,
      }}>
      {children}
    </DifficultSentencesContext.Provider>
  );
};
