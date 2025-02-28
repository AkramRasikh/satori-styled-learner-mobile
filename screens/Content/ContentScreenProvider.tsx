import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import {useNavigation} from '@react-navigation/native';
import useData from '../../context/Data/useData';

export const ContentScreenContext = createContext(null);

export const ContentScreenProvider = ({
  setUpdateWordList,
  updateWordList,
  children,
}: PropsWithChildren<{}>) => {
  const {saveWordFirebase} = useData();
  const [updateWordSentence, setUpdateWordSentence] = useState(false);
  const [highlightStateArr, setHighlightedStateArr] = useState([]);
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
  return (
    <ContentScreenContext.Provider
      value={{
        handleSaveWordContentScreen,
        updateWordSentence,
        updateWordList,
        setHighlightedStateArr,
        highlightStateArr,
        enableScroll,
      }}>
      {children}
    </ContentScreenContext.Provider>
  );
};
