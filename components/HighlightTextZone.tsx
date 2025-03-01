import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {View} from 'react-native';
import useOpenGoogleTranslate from '../hooks/useOpenGoogleTranslate';
import HighlightTextActions from './HighlightTextActions';
import HighlightTextHover from './HighlightTextHover';
import HighlightTextArea from './HighlightTextArea';

const HighlightTextZone = ({
  id,
  text,
  highlightedIndices,
  setHighlightedIndices,
  saveWordFirebase,
  setHighlightMode,
  setIsSettingsOpenState,
  handleQuickGoogleTranslate,
  onHighlightedMount,
  onHighlightedUnMount,
}) => {
  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const getHighlightedText = () => {
    if (highlightedIndices.length === 0) {
      return '';
    }
    let targetText = '';

    text.split('').forEach((char, index) => {
      const isInHighlighted = highlightedIndices.includes(index);

      if (isInHighlighted) {
        targetText = targetText + char;
      }
    });

    return targetText;
  };

  const handleClose = () => {
    setHighlightedIndices([]);
    setHighlightMode(false);
    setIsSettingsOpenState?.();
  };

  const handleOpenUpGoogle = () => {
    openGoogleTranslateApp(getHighlightedText() || text);
  };

  const handleCopyText = () => {
    const highlightedText = getHighlightedText();
    if (highlightedText) {
      Clipboard.setString(highlightedText);
      setHighlightedIndices([]);
    }
  };

  const handleSaveWord = isGoogle => {
    const highlightedText = getHighlightedText();
    if (highlightedText) {
      saveWordFirebase({
        highlightedWord: highlightedText,
        highlightedWordSentenceId: id,
        contextSentence: text,
        isGoogle,
      });
      setHighlightedIndices([]);
      setHighlightMode(false);
    }
  };

  return (
    <View>
      {highlightedIndices?.length > 0 ? (
        <HighlightTextHover getHighlightedText={getHighlightedText} />
      ) : null}
      <HighlightTextArea
        onHighlightedMount={onHighlightedMount}
        onHighlightedUnMount={onHighlightedUnMount}
        setHighlightedIndices={setHighlightedIndices}
        highlightedIndices={highlightedIndices}
        handleClose={handleClose}
        text={text}
      />
      {highlightedIndices?.length > 0 ? (
        <HighlightTextActions
          getHighlightedText={getHighlightedText}
          handleSaveWord={handleSaveWord}
          handleQuickGoogleTranslate={handleQuickGoogleTranslate}
          handleClose={handleClose}
          handleCopyText={handleCopyText}
          handleOpenUpGoogle={handleOpenUpGoogle}
        />
      ) : null}
    </View>
  );
};

export default HighlightTextZone;
