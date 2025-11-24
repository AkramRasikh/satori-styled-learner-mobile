import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import useLoadDifficultSentences from '../../hooks/useLoadDifficultSentences';
import useLanguageSelector from '../LanguageSelector/useLanguageSelector';
import useData from '../Data/useData';
import {useSelector} from 'react-redux';
import useWordData from '../WordData/useWordData';

export const DifficultSentencesContext = createContext(null);

export const DifficultSentencesProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [difficultSentencesState, setDifficultSentencesState] = useState([]);
  const [
    difficultSentencesHasBeenSetState,
    setDifficultSentencesHasBeenSetState,
  ] = useState(false);
  const {combineWordsListState, setCombineWordsListState} = useWordData();
  const [combineSentenceContext, setCombineSentenceContext] = useState('');
  const [dueWordsState, setDueWordsState] = useState([]);

  const {
    combineWords,
    squashedSentenceIdsViaContentMemoized,
    wordsForReviewMemoized,
  } = useData();

  const adhocTargetLanguageSentencesState = useSelector(
    state => state.sentences,
  );

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

  const isDueCheck = (sentence, todayDateObj) => {
    return (
      (sentence?.nextReview && sentence.nextReview < todayDateObj) ||
      new Date(sentence?.reviewData?.due) < todayDateObj
    );
  };

  const getAdditionalContextData = arr => {
    if (arr?.length === 0) {
      return null;
    }

    const thisWordsCorrespondingSentenceHelpers = [];

    for (const obj of adhocTargetLanguageSentencesState) {
      if (arr.includes(obj.id)) {
        thisWordsCorrespondingSentenceHelpers.push(obj);
        if (thisWordsCorrespondingSentenceHelpers.length === arr.length) {
          break; // All matches found early
        }
      }
    }

    return thisWordsCorrespondingSentenceHelpers;
  };

  useEffect(() => {
    const difficultSentencesData = getAllDataReady();
    if (
      difficultSentencesData?.length > 0 &&
      !difficultSentencesHasBeenSetState
    ) {
      const dateNow = new Date();
      setDifficultSentencesState(difficultSentencesData);
      setDifficultSentencesHasBeenSetState(true);
      const matchedWordsForCards = [];
      // need to map first sentence with topic
      wordsForReviewMemoized.forEach(item => {
        if (isDueCheck(item, dateNow) || !item?.reviewData) {
          const firstContext = item.contexts[0];

          const thisWordsSentenceData = difficultSentencesData.find(
            i => i.id === firstContext,
          );
          if (
            thisWordsSentenceData &&
            thisWordsSentenceData?.topic &&
            thisWordsSentenceData?.generalTopic
          ) {
            const formattedContext = {
              ...thisWordsSentenceData,
              title: thisWordsSentenceData?.generalTopic,
              fullTitle: thisWordsSentenceData.topic,
            };

            const contextData =
              item.contexts.length > 1
                ? [
                    formattedContext,
                    ...getAdditionalContextData(item.contexts.slice(1)),
                  ]
                : [formattedContext];
            matchedWordsForCards.push({
              ...item,
              topic: thisWordsSentenceData.topic,
              generalTopic: thisWordsSentenceData.generalTopic,
              isWord: true,
              contextData,
            });
          } else {
            const formattedContext = {
              ...thisWordsSentenceData,
              title: 'sentence-helper',
              fullTitle: 'sentence-helper',
            };
            const contextData =
              item.contexts.length > 1
                ? [formattedContext, ...getAdditionalContextData(item.contexts)]
                : [formattedContext];
            matchedWordsForCards.push({
              ...item,
              topic: 'sentence-helper',
              generalTopic: 'sentence-helper',
              isWord: true,
              contextData,
            });
          }
        }
      });

      setDueWordsState(matchedWordsForCards);
    }
  }, [
    difficultSentencesHasBeenSetState,
    wordsForReviewMemoized,
    getAllDataReady,
    squashedSentenceIdsViaContentMemoized,
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
        handleCombineSentences,
        combineWordsListState,
        setCombineWordsListState,
        combineSentenceContext,
        setCombineSentenceContext,
        dueWordsState,
        setDueWordsState,
      }}>
      {children}
    </DifficultSentencesContext.Provider>
  );
};
