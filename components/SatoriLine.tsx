import React, {useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {Text, TouchableOpacity, View} from 'react-native';
import HighlightTextZone from './HighlightTextZone';
import {filterElementsById} from '../utils/filter-elements-by-id';
import SatoriLineControls from './SatoriLineControls';
import SatoriLineSRS from './SatoriLineSRS';

const SatoriLine = ({
  id,
  focusThisSentence,
  playFromThisSentence,
  topicSentence,
  wordTest,
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
  onLongPress,
  topicName,
  updateSentenceData,
}) => {
  const [showEng, setShowEng] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showReviewSettings, setShowReviewSettings] = useState(false);

  const filteredElements = filterElementsById(safeText, 'targetWord');

  const hasBeenMarkedAsDifficult =
    topicSentence?.nextReview || topicSentence?.reviewData?.due;

  const copySentence = () => {
    Clipboard.setString(topicSentence.targetLang);
  };

  const handlePlayThisLine = () => {
    if (isPlaying && focusThisSentence) {
      pauseSound();
    } else {
      playFromThisSentence(topicSentence.id);
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
        textWidth={textWidth}
        hasBeenMarkedAsDifficult={hasBeenMarkedAsDifficult}
        topicName={topicName}
        updateSentenceData={updateSentenceData}
        highlightMode={highlightMode}
        setHighlightMode={setHighlightMode}
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
      {wordTest && filteredElements.length > 0 ? (
        <View
          style={{
            paddingTop: 5,
            paddingBottom: 5,
            width: textWidth,
          }}>
          <Text style={{fontSize: 20}}>
            Target Words:{' '}
            {filteredElements?.map((wordEl, index) => {
              const isLastInArr = index + 1 === filteredElements.length;
              return (
                <View key={index}>
                  <TouchableOpacity onLongPress={() => onLongPress(wordEl)}>
                    <Text>
                      {wordEl} {!isLastInArr ? ', ' : ''}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </Text>
        </View>
      ) : wordTest && filteredElements.length === 0 ? (
        <View
          style={{
            paddingTop: 10,
            width: textWidth,
          }}>
          <Text style={{fontSize: 20}}>No words</Text>
        </View>
      ) : null}
      {showReviewSettings ? (
        <SatoriLineSRS
          sentence={topicSentence}
          topicName={topicName}
          updateSentenceData={updateSentenceData}
          setShowReviewSettings={setShowReviewSettings}
        />
      ) : null}
    </Text>
  );
};

export default SatoriLine;
