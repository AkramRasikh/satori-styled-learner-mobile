import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import {useNavigation} from '@react-navigation/native';
import useData from '../../context/Data/useData';
import {useSelector} from 'react-redux';

export const ContentScreenContext = createContext(null);

export const ContentScreenProvider = ({
  setUpdateWordList,
  updateWordList,
  dueSentences,
  content,
  topicName,
  contentIndex,
  children,
}: PropsWithChildren<{}>) => {
  const {saveWordFirebase, deleteWord, breakdownAllSentences} = useData();

  const [updateWordSentence, setUpdateWordSentence] = useState(false);
  const [highlightStateArr, setHighlightedStateArr] = useState([]);
  const [selectedDueCardState, setSelectedDueCardState] = useState(null);
  const [dueSentencesState, setDueSentencesState] = useState(null);
  const [combineWordsListState, setCombineWordsListState] = useState([]);
  const [loadingCombineSentences, setLoadingCombineSentences] = useState(false);
  const [combineSentenceContext, setCombineSentenceContext] = useState('');
  const [isLoadingReviewSectionState, setIsLoadingReviewSectionState] =
    useState(false);

  const targetLanguageWordsState = useSelector(state => state.words);

  const navigation = useNavigation();
  const enableScroll = highlightStateArr.length === 0;

  const {combineWords} = useData();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: enableScroll,
    });
  }, [enableScroll, navigation]);

  useEffect(() => {
    setDueSentencesState(dueSentences);
  }, [dueSentences]);

  const handleBreakdownAllSentences = async () => {
    try {
      setIsLoadingReviewSectionState(true);
      const sentencesToBreakdown = content
        .filter(item => !(item?.vocab || item?.sentenceStructure))
        .slice(0, 9);

      if (sentencesToBreakdown?.length > 0) {
        await breakdownAllSentences({
          topicName,
          sentences: sentencesToBreakdown.map(item => ({
            id: item.id,
            targetLang: item.targetLang,
          })),
          contentIndex,
        });
      } else {
        setIsLoadingReviewSectionState(false);
      }
    } catch (error) {
    } finally {
      setIsLoadingReviewSectionState(false);
    }
  };

  const handleExportListToAI = async () => {
    try {
      setLoadingCombineSentences(true);
      await combineWords({
        myCombinedSentence: combineSentenceContext,
        inputWords: combineWordsListState,
      });
      setCombineWordsListState([]);
      setCombineSentenceContext('');
    } catch (error) {
      console.log('## Error combining!', error);
    } finally {
      setLoadingCombineSentences(false);
    }
  };

  const handleSaveWordContentScreen = async wordToSave => {
    try {
      const wordSaved = await saveWordFirebase(wordToSave);
      if (wordSaved) {
        setUpdateWordList(true);
        setUpdateWordSentence(true);
      }
    } catch (error) {
    } finally {
      setUpdateWordSentence(false);
    }
  };

  const handleDeleteWord = async () => {
    await deleteWord({
      wordId: selectedDueCardState.id,
      wordBaseForm: selectedDueCardState.baseForm,
    });
    setSelectedDueCardState(null);
  };

  const handleSelectWord = selectingWord => {
    const mostUpToDateWord = targetLanguageWordsState.find(
      i => i.id === selectingWord.id,
    );
    if (mostUpToDateWord) {
      setSelectedDueCardState(mostUpToDateWord);
    }
  };
  return (
    <ContentScreenContext.Provider
      value={{
        handleSaveWordContentScreen,
        updateWordSentence,
        updateWordList,
        setHighlightedStateArr,
        highlightStateArr,
        enableScroll,
        handleSelectWord,
        selectedDueCardState,
        setSelectedDueCardState,
        handleDeleteWord,
        dueSentencesState,
        setDueSentencesState,
        combineWordsListState,
        setCombineWordsListState,
        handleExportListToAI,
        loadingCombineSentences,
        combineSentenceContext,
        setCombineSentenceContext,
        handleBreakdownAllSentences,
        isLoadingReviewSectionState,
      }}>
      {children}
    </ContentScreenContext.Provider>
  );
};
