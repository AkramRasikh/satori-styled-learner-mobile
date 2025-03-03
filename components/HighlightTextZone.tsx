import Clipboard from '@react-native-clipboard/clipboard';
import React, {useState} from 'react';
import {View} from 'react-native';
import useOpenGoogleTranslate from '../hooks/useOpenGoogleTranslate';
import HighlightTextActions from './HighlightTextActions';
import HighlightTextHover from './HighlightTextHover';
import HighlightTextArea from './HighlightTextArea';
import HighlightTextAreaArabic from './HighlightTextAreaArabic';
import useLanguageSelector from '../context/LanguageSelector/useLanguageSelector';
import {LanguageEnum} from '../context/LanguageSelector/LanguageSelectorProvider';

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
  isFirst,
}) => {
  const [reversedArabicTextState, setReversedArabicTextState] = useState('');

  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const {languageSelectedState} = useLanguageSelector();

  const isArabic = languageSelectedState === LanguageEnum.Arabic;

  const getHighlightedTextArabic = () => {
    if (highlightedIndices.length === 0 || !reversedArabicTextState) {
      return '';
    }
    let targetText = '';

    reversedArabicTextState.split(/([\s.]+)/).forEach((char, index) => {
      const isInHighlighted = highlightedIndices.includes(index);

      if (isInHighlighted) {
        targetText = targetText + char;
      }
    });

    return targetText.split(' ').reverse().join(' ');
  };

  const getHighlightedText = () => {
    if (isArabic) {
      return getHighlightedTextArabic();
    }
    if (highlightedIndices.length === 0) {
      return '';
    }
    let targetText = '';

    const splitText = isArabic ? text.split(/([\s.]+)/) : text.split('');
    splitText.forEach((char, index) => {
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
        <HighlightTextHover
          getHighlightedText={getHighlightedText}
          handleQuickGoogleTranslate={handleQuickGoogleTranslate}
          handleClose={handleClose}
          isFirst={isFirst}
        />
      ) : null}
      {isArabic ? (
        <HighlightTextAreaArabic
          onHighlightedMount={onHighlightedMount}
          onHighlightedUnMount={onHighlightedUnMount}
          setHighlightedIndices={setHighlightedIndices}
          highlightedIndices={highlightedIndices}
          handleClose={handleClose}
          reversedArabicTextState={reversedArabicTextState}
          setReversedArabicTextState={setReversedArabicTextState}
          text={text}
        />
      ) : (
        <HighlightTextArea
          onHighlightedMount={onHighlightedMount}
          onHighlightedUnMount={onHighlightedUnMount}
          setHighlightedIndices={setHighlightedIndices}
          highlightedIndices={highlightedIndices}
          handleClose={handleClose}
          text={text}
        />
      )}
      {highlightedIndices?.length > 0 ? (
        <HighlightTextActions
          handleSaveWord={handleSaveWord}
          handleCopyText={handleCopyText}
          handleOpenUpGoogle={handleOpenUpGoogle}
        />
      ) : null}
    </View>
  );
};

export default HighlightTextZone;
