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
  children,
}: PropsWithChildren<{}>) => {
  const {saveWordFirebase, deleteWord} = useData();
  const [updateWordSentence, setUpdateWordSentence] = useState(false);
  const [highlightStateArr, setHighlightedStateArr] = useState([]);
  const [selectedDueCardState, setSelectedDueCardState] = useState(null);

  const targetLanguageWordsState = useSelector(state => state.words);

  const navigation = useNavigation();
  const enableScroll = highlightStateArr.length === 0;

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: enableScroll,
    });
  }, [enableScroll, navigation]);

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
      }}>
      {children}
    </ContentScreenContext.Provider>
  );
};
