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
  handleQuickGoogleTranslate,
}) => {
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [isBlurredState, setIsBlurredState] = useState(true);

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
        <View>
          <HighlightTextZone
            id={sentenceId}
            text={targetLang}
            highlightedIndices={highlightedIndices}
            setHighlightedIndices={setHighlightedIndices}
            saveWordFirebase={handleSaveWordToFB}
            setHighlightMode={setHighlightMode}
            handleQuickGoogleTranslate={handleQuickGoogleTranslate}
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
