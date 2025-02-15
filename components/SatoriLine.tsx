import React, {useEffect, useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {Text, View} from 'react-native';
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

const SatoriLine = ({
  id,
  focusThisSentence,
  playFromThisSentence,
  topicSentence,
  englishOnly,
  highlightMode,
  highlightedIndices,
  setHighlightedIndices,
  sentenceIndex,
  saveWordFirebase,
  engMaster,
  isPlaying,
  pauseSound,
  textWidth,
  setHighlightMode,
  topicName,
  updateSentenceData,
  contentIndex,
  breakdownSentenceFunc,
}) => {
  const [showEng, setShowEng] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showReviewSettings, setShowReviewSettings] = useState(false);
  const [showSentenceBreakdown, setShowSentenceBreakdown] = useState(false);
  const [showMatchedTranslation, setShowMatchedTranslation] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [safeTextState, setSafeTextState] = useState();

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

  const handleSaveWord = async objToSave => {
    const resBool = await saveWordFirebase(objToSave);
    if (resBool) {
      setSafeTextState(getThisText());
    }
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
        <TextSegmentContainer
          textSegments={textSegments}
          wordsInOverlapCheck={wordsInOverlapCheck}
          matchedWordListState={matchedWordsWithColors}
        />
      );
    } else {
      return topicSentence.safeText;
    }
  };

  useEffect(() => {
    setSafeTextState(getThisText());
  }, [showSentenceBreakdown, showMatchedTranslation, setSafeTextState]);

  const openReviewPortal = () => {
    setShowReviewSettings(!showReviewSettings);
  };

  return (
    <View
      style={{
        opacity: isLoadingState ? 0.5 : 1,
      }}>
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
          color: hasBeenMarkedAsDifficult ? '#8B0000' : 'black',
          fontSize: 20,
        }}>
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
          highlightMode={highlightMode}
          setHighlightMode={setHighlightMode}
          showSentenceBreakdown={showSentenceBreakdown}
          setShowSentenceBreakdown={setShowSentenceBreakdown}
          getSentenceBreakdown={getSentenceBreakdown}
          setShowMatchedTranslation={setShowMatchedTranslation}
          showMatchedTranslation={showMatchedTranslation}
        />
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
          }}>
          <Text
            selectable={true}
            style={{color: hasBeenMarkedAsDifficult ? '#8B0000' : 'black'}}>
            {topicSentence.baseLang}
          </Text>
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

export default SatoriLine;
