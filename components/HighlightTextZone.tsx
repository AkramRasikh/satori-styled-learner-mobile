import Clipboard from '@react-native-clipboard/clipboard';
import React, {useState} from 'react';
import {View} from 'react-native';
// import useOpenGoogleTranslate from '../hooks/useOpenGoogleTranslate';
import HighlightTextActions from './HighlightTextActions';
import HighlightTextHover from './HighlightTextHover';
import HighlightTextArea from './HighlightTextArea';
import HighlightTextAreaArabic from './HighlightTextAreaArabic';
import useLanguageSelector from '../context/LanguageSelector/useLanguageSelector';
import {LanguageEnum} from '../context/LanguageSelector/LanguageSelectorProvider';
import {
  ActivityIndicator,
  Button,
  Checkbox,
  MD3Colors,
  Text,
  TextInput,
} from 'react-native-paper';
import useData from '../context/Data/useData';

const GrammarTextInputContainer = ({
  grammarTextInput,
  setGrammarTextInput,
  includeVariations,
  setIncludeVariations,
  handleSubmitGrammarCheck,
  isSubtleDiff,
  setIsSubtleDiff,
}) => (
  <View style={{marginVertical: 10}}>
    <TextInput
      label="Context"
      value={grammarTextInput}
      onChangeText={setGrammarTextInput}
      mode="outlined"
    />
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
      }}>
      <Checkbox.Android
        status={includeVariations ? 'checked' : 'unchecked'}
        onPress={() => setIncludeVariations(!includeVariations)}
      />
      <Text style={{marginLeft: 5}}>Include variations</Text>
      <Checkbox.Android
        status={isSubtleDiff ? 'checked' : 'unchecked'}
        onPress={() => setIsSubtleDiff(!isSubtleDiff)}
      />
      <Text style={{marginLeft: 5}}>Subtle diff</Text>
    </View>
    <Button
      onPress={handleSubmitGrammarCheck}
      mode="outlined"
      textColor={MD3Colors.error50}>
      Get similar grammar examples
    </Button>
  </View>
);

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
  const [reversedArabicTextState, setReversedArabicTextState] = useState('');
  const [isLoadingState, setisLoadingState] = useState(false);
  const [openGrammarTextState, setOpenGrammarTextState] = useState(false);
  const [grammarTextInput, setGrammarTextInput] = useState('');
  const [includeVariations, setIncludeVariations] = useState(false);
  const [isSubtleDiff, setIsSubtleDiff] = useState(false);

  const {addAdhocGrammar} = useData();

  // const {openGoogleTranslateApp} = useOpenGoogleTranslate();

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

  // const handleOpenUpGoogle = () => {
  //   openGoogleTranslateApp(getHighlightedText() || text);
  // };

  const handleSubmitGrammarCheck = async () => {
    console.log('## handleSubmitGrammarCheck', {
      language: languageSelectedState,
      baseSentence: text,
      context: grammarTextInput,
      grammarSection: getHighlightedText() || '',
      includeVariations,
      isSubtleDiff,
    });

    try {
      setisLoadingState(true);
      await addAdhocGrammar({
        language: languageSelectedState,
        baseSentence: text,
        context: grammarTextInput,
        grammarSection: getHighlightedText() || '',
        includeVariations,
        isSubtleDiff,
      });
    } catch (error) {
      console.log('## handleSubmitGrammarCheck error', error);
    } finally {
      setHighlightMode(false);
      setisLoadingState(false);
    }
  };

  const handleCopyText = () => {
    const highlightedText = getHighlightedText();
    if (highlightedText) {
      Clipboard.setString(highlightedText);
      setHighlightedIndices([]);
    }
  };

  const handleGetGrammarExamples = () => {
    setOpenGrammarTextState(!openGrammarTextState);
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
    <>
      {isLoadingState && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: '30%',
            zIndex: 100,
          }}
        />
      )}
      {highlightedIndices?.length > 0 ? (
        <View>
          <HighlightTextHover
            getHighlightedText={getHighlightedText}
            handleQuickGoogleTranslate={handleQuickGoogleTranslate}
            handleClose={handleClose}
          />
        </View>
      ) : null}
      <View>
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
            handleGetGrammarExamples={handleGetGrammarExamples}
          />
        ) : null}
        {openGrammarTextState && (
          <GrammarTextInputContainer
            grammarTextInput={grammarTextInput}
            setGrammarTextInput={setGrammarTextInput}
            includeVariations={includeVariations}
            setIncludeVariations={setIncludeVariations}
            handleSubmitGrammarCheck={handleSubmitGrammarCheck}
            isSubtleDiff={isSubtleDiff}
            setIsSubtleDiff={setIsSubtleDiff}
          />
        )}
      </View>
    </>
  );
};

export default HighlightTextZone;
