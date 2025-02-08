import React, {useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {Text, View} from 'react-native';
import HighlightTextZone from './HighlightTextZone';
import SatoriLineControls from './SatoriLineControls';
import SatoriLineSRS from './SatoriLineSRS';

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
  safeText,
  textWidth,
  setHighlightMode,
  topicName,
  updateSentenceData,
  contentIndex,
}) => {
  const [showEng, setShowEng] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showReviewSettings, setShowReviewSettings] = useState(false);
  const [showSentenceBreakdown, setShowSentenceBreakdown] = useState(false);

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

  const openReviewPortal = () => {
    setShowReviewSettings(!showReviewSettings);
  };

  return (
    <Text
      selectable={true}
      style={{
        backgroundColor: focusThisSentence ? 'yellow' : 'transparent',
        color: hasBeenMarkedAsDifficult ? '#8B0000' : 'black',
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
      />
      {englishOnly ? null : highlightMode ? (
        <HighlightTextZone
          id={id}
          sentenceIndex={sentenceIndex}
          text={topicSentence.targetLang}
          highlightedIndices={highlightedIndices}
          setHighlightedIndices={setHighlightedIndices}
          saveWordFirebase={saveWordFirebase}
          setHighlightMode={setHighlightMode}
          textWidth={textWidth}
        />
      ) : (
        safeText
      )}
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
      {showNotes ? <Text>{topicSentence.notes}</Text> : null}
      {showReviewSettings ? (
        <SatoriLineSRS
          sentence={topicSentence}
          topicName={topicName}
          updateSentenceData={updateSentenceData}
          setShowReviewSettings={setShowReviewSettings}
          contentIndex={contentIndex}
        />
      ) : null}
    </Text>
  );
};

export default SatoriLine;
