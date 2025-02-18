import React, {useEffect, useRef, useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {Text, TouchableOpacity, View} from 'react-native';
import HighlightTextZone from './HighlightTextZone';
import SatoriLineControls from './SatoriLineControls';
import SatoriLineSRS from './SatoriLineSRS';
import SentenceBreakdown from './SentenceBreakdown';
import {getHexCode} from '../utils/get-hex-code';
import useLanguageSelector from '../context/LanguageSelector/useLanguageSelector';
import {ActivityIndicator, Icon, MD2Colors} from 'react-native-paper';
import DifficultSentenceMappedWords from './DifficultSentence/DifficultSentenceMappedWords';
import {checkOverlap} from '../utils/check-word-overlap';
import TextSegmentContainer from './TextSegmentContainer';
import useContentScreen from '../screens/Content/useContentScreen';
import {DoubleClickButton} from './Button';

const BilingualLine = ({
  id,
  focusThisSentence,
  playFromThisSentence,
  topicSentence,
  englishOnly,
  highlightedIndices,
  setHighlightedIndices,
  sentenceIndex,
  engMaster,
  isPlaying,
  pauseSound,
  textWidth,
  topicName,
  updateSentenceData,
  contentIndex,
  breakdownSentenceFunc,
  handleOpenGoogle,
  scrollViewRef,
  isAutoScrollingMode,
}) => {
  const [showEng, setShowEng] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showReviewSettings, setShowReviewSettings] = useState(false);
  const [showSentenceBreakdown, setShowSentenceBreakdown] = useState(false);
  const [showMatchedTranslation, setShowMatchedTranslation] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isSettingsOpenState, setIsSettingsOpenState] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [safeTextState, setSafeTextState] = useState();

  const targetRef = useRef(null);

  const {handleSaveWordContentScreen, updateWordList} = useContentScreen();

  const matchedWords = topicSentence?.matchedWords.length > 0;
  const hasSentenceBreakdown = topicSentence?.vocab;
  useEffect(() => {
    if (
      isAutoScrollingMode &&
      scrollViewRef?.current &&
      focusThisSentence &&
      targetRef?.current
    ) {
      targetRef.current?.measureLayout(scrollViewRef.current, (_, y) => {
        scrollViewRef.current?.scrollTo({y: y - 100, animated: true});
      });
    }
  }, [focusThisSentence, scrollViewRef, isAutoScrollingMode, targetRef]);

  const {languageSelectedState} = useLanguageSelector();
  const getSentenceBreakdown = async () => {
    setIsLoadingState(true);
    try {
      await breakdownSentenceFunc({
        topicName,
        sentenceId: topicSentence.id,
        language: languageSelectedState,
        targetLang: topicSentence.targetLang,
        contentIndex,
      });
    } catch (error) {
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleSaveWord = async wordToSave => {
    setShowReviewSettings(false);
    setIsSettingsOpenState(false);
    await handleSaveWordContentScreen(wordToSave);
  };

  const handleOpenGoogleFunc = () => {
    handleOpenGoogle(topicSentence.targetLang);
  };

  const hasBeenMarkedAsDifficult =
    topicSentence?.nextReview || topicSentence?.reviewData?.due;

  const copySentence = () => {
    Clipboard.setString(topicSentence.targetLang);
  };

  const handlePlayThisLine = () => {
    if (isPlaying && focusThisSentence) {
      pauseSound();
    } else {
      playFromThisSentence(topicSentence.startAt);
    }
  };

  const handleOnSafeTextPress = () => {
    setIsSettingsOpenState(true);
    setHighlightMode(true);
  };

  const getThisText = () => {
    if (showSentenceBreakdown) {
      const vocabBreakDoownWithHexCode = showSentenceBreakdown
        ? topicSentence.vocab.map((i, index) => {
            return {
              ...i,
              color: getHexCode(index),
            };
          })
        : null;
      return (
        <Text>
          {vocabBreakDoownWithHexCode.map((nestedSegment, index) => (
            <Text key={index} style={{color: nestedSegment.color}}>
              {nestedSegment.surfaceForm}
            </Text>
          ))}
        </Text>
      );
    } else if (showMatchedTranslation) {
      const textSegments = topicSentence.safeText.props.textSegments;
      const wordsInOverlapCheck = checkOverlap(
        topicSentence.matchedWords.map((i, index) => ({
          ...i,
          colorIndex: index,
        })),
      );
      const matchedWordsWithColors = topicSentence.matchedWords.map(
        (i, index) => ({...i, colorIndex: index}),
      );
      return (
        <TouchableOpacity
          onLongPress={() =>
            setShowMatchedTranslation(!showMatchedTranslation)
          }>
          <TextSegmentContainer
            textSegments={textSegments}
            wordsInOverlapCheck={wordsInOverlapCheck}
            matchedWordListState={matchedWordsWithColors}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <DoubleClickButton
          onLongPress={
            matchedWords
              ? () => setShowMatchedTranslation(!showMatchedTranslation)
              : () => {}
          }
          onPress={handleOnSafeTextPress}>
          {topicSentence.safeText}
        </DoubleClickButton>
      );
    }
  };

  useEffect(() => {
    setSafeTextState(getThisText());
  }, [
    showSentenceBreakdown,
    showMatchedTranslation,
    setSafeTextState,
    updateWordList,
  ]);

  const openReviewPortal = () => {
    setShowReviewSettings(!showReviewSettings);
  };

  return (
    <View
      style={{
        opacity: isLoadingState ? 0.5 : 1,
      }}
      ref={targetRef}>
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
      <Text
        selectable={true}
        style={{
          backgroundColor: focusThisSentence ? 'yellow' : 'transparent',
          fontSize: 20,
        }}>
        <View>
          {isSettingsOpenState && (
            <SatoriLineControls
              handlePlayThisLine={handlePlayThisLine}
              isPlaying={isPlaying}
              focusThisSentence={focusThisSentence}
              copySentence={copySentence}
              openReviewPortal={openReviewPortal}
              topicSentence={topicSentence}
              setShowEng={setShowEng}
              showEng={showEng}
              setShowNotes={setShowNotes}
              showNotes={showNotes}
              showSentenceBreakdown={showSentenceBreakdown}
              setShowSentenceBreakdown={setShowSentenceBreakdown}
              getSentenceBreakdown={getSentenceBreakdown}
              setShowMatchedTranslation={setShowMatchedTranslation}
              showMatchedTranslation={showMatchedTranslation}
              handleOpenGoogle={handleOpenGoogleFunc}
              setIsSettingsOpenState={setIsSettingsOpenState}
              matchedWords={matchedWords}
              hasSentenceBreakdown={hasSentenceBreakdown}
            />
          )}
          {!isSettingsOpenState && (
            <View
              style={{
                width: '100%',
                marginBottom: highlightMode ? 3 : 0,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => setIsSettingsOpenState(true)}
                style={{
                  backgroundColor: hasBeenMarkedAsDifficult
                    ? MD2Colors.red600
                    : 'transparent',
                  borderRadius: 5,
                }}>
                <Icon
                  source="menu"
                  size={20}
                  color={
                    hasBeenMarkedAsDifficult
                      ? MD2Colors.grey100
                      : MD2Colors.amber800
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePlayThisLine}
                style={{
                  marginRight: 15,
                }}>
                <Text>{isPlaying && focusThisSentence ? '⏸' : '▶️'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {englishOnly ? null : highlightMode ? (
          <HighlightTextZone
            id={id}
            sentenceIndex={sentenceIndex}
            text={topicSentence.targetLang}
            highlightedIndices={highlightedIndices}
            setHighlightedIndices={setHighlightedIndices}
            saveWordFirebase={handleSaveWord}
            setHighlightMode={setHighlightMode}
            textWidth={textWidth}
          />
        ) : (
          safeTextState
        )}
      </Text>
      {showEng || englishOnly || engMaster ? (
        <View
          style={{
            paddingTop: 5,
            width: textWidth,
            alignItems: 'flex-end',
            opacity: 0.5,
          }}>
          <Text selectable={true}>{topicSentence.baseLang}</Text>
        </View>
      ) : null}
      {showSentenceBreakdown ? (
        <SentenceBreakdown
          vocab={topicSentence.vocab}
          sentenceStructure={topicSentence.sentenceStructure}
        />
      ) : null}
      {showNotes ? <Text>{topicSentence.notes}</Text> : null}
      {showReviewSettings ? (
        <SatoriLineSRS
          sentence={topicSentence}
          updateSentenceData={updateSentenceData}
          setShowReviewSettings={setShowReviewSettings}
          contentIndex={contentIndex}
          setIsSettingsOpenState={setIsSettingsOpenState}
        />
      ) : null}
      {showMatchedTranslation &&
        topicSentence.matchedWords.map((item, index) => {
          return (
            <DifficultSentenceMappedWords
              key={index}
              item={item}
              handleSelectWord={() => {}}
              deleteWord={() => {}}
              handleUpdateWordFinal={() => {}}
              indexNum={index}
              overrideReview
            />
          );
        })}
    </View>
  );
};

export default BilingualLine;
