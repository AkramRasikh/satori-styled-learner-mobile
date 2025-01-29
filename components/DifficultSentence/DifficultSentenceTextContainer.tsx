import React, {useState} from 'react';
import {Text, View} from 'react-native';
import HighlightTextZone from '../HighlightTextZone';
import useData from '../../context/Data/useData';

const DifficultSentenceTextContainer = ({
  targetLang,
  baseLang,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  sentenceId,
  safeTextFunc,
  highlightedIndices,
  setHighlightedIndices,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const {saveWordFirebase} = useData();

  const highlightMode = sentenceId === sentenceBeingHighlightedState;

  const handleLayout = event => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const handleSaveWordToFB = ({
    highlightedWord,
    highlightedWordSentenceId,
    isGoogle,
  }) => {
    saveWordFirebase({
      highlightedWord,
      highlightedWordSentenceId,
      contextSentence: targetLang,
      isGoogle,
    });
    setSentenceBeingHighlightedState('');
  };

  return (
    <>
      {highlightMode ? (
        <View
          onLayout={handleLayout} // Attach the onLayout event handler
        >
          <HighlightTextZone
            id={sentenceId}
            sentenceIndex={0}
            text={targetLang}
            highlightedIndices={highlightedIndices}
            setHighlightedIndices={setHighlightedIndices}
            saveWordFirebase={handleSaveWordToFB}
            textWidth={containerWidth}
          />
        </View>
      ) : (
        safeTextFunc(targetLang)
      )}
      <View>
        <Text>{baseLang}</Text>
      </View>
    </>
  );
};

export default DifficultSentenceTextContainer;
