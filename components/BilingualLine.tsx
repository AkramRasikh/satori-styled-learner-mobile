import React, {useEffect, useRef, useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {Text, PanResponder, View} from 'react-native';
import HighlightTextZone from './HighlightTextZone';
import SatoriLineControls from './SatoriLineControls';
import SatoriLineSRS from './SatoriLineSRS';
import SentenceBreakdown from './SentenceBreakdown';
import {getHexCode} from '../utils/get-hex-code';
import useLanguageSelector from '../context/LanguageSelector/useLanguageSelector';
import {ActivityIndicator} from 'react-native-paper';
import DifficultSentenceMappedWords from './DifficultSentence/DifficultSentenceMappedWords';
import {checkOverlap} from '../utils/check-word-overlap';
import TextSegmentContainer from './TextSegmentContainer';
import useContentScreen from '../screens/Content/useContentScreen';
import {DoubleClickButton} from './Button';
import BilingualLineSettings from './BilingualLineSettings';
import {translateText} from '../api/google-translate';

const BilingualLine = ({
  id,
  focusThisSentence,
  playFromThisSentence,
  topicSentence,
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
  setShowQuickReviewState,
  isFirst,
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
  const [quickTranslationArr, setQuickTranslationArr] = useState([]);
  const [highlightedIndices, setHighlightedIndices] = useState([]);

  const {languageSelectedState} = useLanguageSelector();

  const targetRef = useRef(null);
  const swipeDistance = useRef(0);

  const handleQuickGoogleTranslate = async text => {
    try {
      setIsLoadingState(true);
      const result = await translateText({
        text,
        language: languageSelectedState,
      });
      setQuickTranslationArr(prev => [...prev, result]);
    } catch (error) {
    } finally {
      setIsLoadingState(false);
    }
  };

  const {
    handleSaveWordContentScreen,
    updateWordList,
    setHighlightedStateArr,
    highlightStateArr,
  } = useContentScreen();

  const onHighlightedMount = () => {
    const updated = [...highlightStateArr, id];
    setHighlightedStateArr(updated);
  };
  const onHighlightedUnMount = () => {
    const updated = highlightStateArr.filter(item => item !== id);
    setHighlightedStateArr(updated);
  };

  const matchedWords = topicSentence?.matchedWords.length > 0;
  const hasSentenceBreakdown = topicSentence?.vocab;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        swipeDistance.current = 0;
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        swipeDistance.current += gestureState.dx; // Accumulate swipe distance
        if (swipeDistance.current < -150 && !highlightMode) {
          setShowQuickReviewState(true); // Set state when 50px threshold is reached
          swipeDistance.current = 0; // Reset to prevent multiple triggers
        }
      },
    }),
  ).current;

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
    setShowMatchedTranslation(false);
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
        <DoubleClickButton
          onLongPress={() => setShowMatchedTranslation(!showMatchedTranslation)}
          onPress={handleOnSafeTextPress}>
          <TextSegmentContainer
            textSegments={textSegments}
            wordsInOverlapCheck={wordsInOverlapCheck}
            matchedWordListState={matchedWordsWithColors}
          />
        </DoubleClickButton>
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
  const spreadHandler = highlightMode ? {} : panResponder.panHandlers;

  const hasQuickTranslation =
    isSettingsOpenState && quickTranslationArr.length > 0;
  return (
    <View
      {...spreadHandler}
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
      <View
        style={{
          backgroundColor: focusThisSentence ? 'yellow' : 'transparent',
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
            <BilingualLineSettings
              highlightMode={highlightMode}
              setIsSettingsOpenState={setIsSettingsOpenState}
              hasBeenMarkedAsDifficult={hasBeenMarkedAsDifficult}
              handlePlayThisLine={handlePlayThisLine}
              isPlaying={isPlaying}
              focusThisSentence={focusThisSentence}
            />
          )}
        </View>
        {highlightMode ? (
          <HighlightTextZone
            id={id}
            text={topicSentence.targetLang}
            highlightedIndices={highlightedIndices}
            setHighlightedIndices={setHighlightedIndices}
            saveWordFirebase={handleSaveWord}
            setHighlightMode={setHighlightMode}
            setIsSettingsOpenState={setIsSettingsOpenState}
            handleQuickGoogleTranslate={handleQuickGoogleTranslate}
            onHighlightedMount={onHighlightedMount}
            onHighlightedUnMount={onHighlightedUnMount}
            isFirst={isFirst}
          />
        ) : (
          safeTextState
        )}
      </View>
      {hasQuickTranslation && (
        <View style={{gap: 5, marginVertical: 5}}>
          {quickTranslationArr.map((item, key) => {
            const countNumber = key + 1 + ') ';
            return (
              <View key={key}>
                <Text>
                  {countNumber}
                  {item.text}, {item.transliteration}, {item.translation}
                </Text>
              </View>
            );
          })}
        </View>
      )}
      {showEng || engMaster ? (
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
          meaning={topicSentence.meaning}
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
