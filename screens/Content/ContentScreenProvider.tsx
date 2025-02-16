import React, {createContext, PropsWithChildren, useState} from 'react';
import useData from '../../context/Data/useData';

export const ContentScreenContext = createContext(null);

export const ContentScreenProvider = ({
  setUpdateWordList,
  updateWordList,
  children,
}: PropsWithChildren<{}>) => {
  const {saveWordFirebase} = useData();
  const [updateWordSentence, setUpdateWordSentence] = useState(false);

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
      }}>
      {children}
    </ContentScreenContext.Provider>
  );
};
