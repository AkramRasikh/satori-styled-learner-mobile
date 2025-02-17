import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import HighlightTextZone from '../HighlightTextZone';
import {Text} from 'react-native-paper';

const DifficultSentenceTextContainer = ({
  targetLang,
  baseLang,
  sentenceId,
  safeTextFunc,
  saveWordFirebase,
  isHighlightMode,
  setHighlightMode,
}) => {
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isBlurredState, setIsBlurredState] = useState(true);

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
  };

  return (
    <>
      {isHighlightMode ? (
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
            setHighlightMode={setHighlightMode}
          />
        </View>
      ) : (
        safeTextFunc(targetLang)
      )}
      <TouchableOpacity
        style={{
          opacity: isBlurredState ? 0.1 : 1,
          alignItems: isBlurredState ? 'flex-end' : 'flex-start',
        }}
        onLongPress={() => setIsBlurredState(!isBlurredState)}>
        <Text
          style={{
            fontSize: isBlurredState ? 10 : 12,
          }}>
          {baseLang}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default DifficultSentenceTextContainer;
