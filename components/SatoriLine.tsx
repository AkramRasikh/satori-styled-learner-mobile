import React, {useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {Text, TouchableOpacity, View} from 'react-native';
import HighlightTextZone from './HighlightTextZone';
import {filterElementsById} from '../utils/filter-elements-by-id';

const SatoriLine = ({
  id,
  focusThisSentence,
  playFromThisSentence,
  getSafeText,
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
  preLoadedSafeText,
  textWidth,
  setHighlightMode,
}) => {
  const [showEng, setShowEng] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const safeText = preLoadedSafeText || getSafeText(topicSentence.targetLang);

  const filteredElements = filterElementsById(safeText, 'targetWord');

  const copySentence = () => {
    Clipboard.setString(topicSentence.targetLang);
  };

  const handlePlayThisLine = () => {
    if (isPlaying) {
      pauseSound();
    } else {
      playFromThisSentence(topicSentence.id);
    }
  };

  return (
    <Text
      selectable={true}
      style={{
        backgroundColor: focusThisSentence ? 'yellow' : 'transparent',
      }}>
      <TouchableOpacity onPress={handlePlayThisLine}>
        {isPlaying ? (
          <Text style={{marginRight: 5}}>⏸️</Text>
        ) : (
          <Text style={{marginRight: 5}}>▶️</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowEng(!showEng)}>
        <Text style={{marginRight: 5}}>🇬🇧</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={copySentence}>
        <Text style={{marginRight: 5}}>📋</Text>
      </TouchableOpacity>
      {topicSentence.notes ? (
        <TouchableOpacity onPress={() => setShowNotes(!showNotes)}>
          <Text style={{marginRight: 5}}>☝🏽</Text>
        </TouchableOpacity>
      ) : null}
      {englishOnly ? null : highlightMode ? (
        <HighlightTextZone
          id={id}
          sentenceIndex={sentenceIndex}
          text={topicSentence.targetLang}
          highlightedIndices={highlightedIndices}
          setHighlightedIndices={setHighlightedIndices}
          saveWordFirebase={saveWordFirebase}
          setHighlightMode={setHighlightMode}
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
          <Text selectable={true}>{topicSentence.baseLang}</Text>
        </View>
      ) : null}
      {showNotes ? <Text>{topicSentence.notes}</Text> : null}
      {wordTest && filteredElements.length > 0 ? (
        <View
          style={{
            paddingTop: 10,
            width: textWidth,
          }}>
          <Text style={{fontSize: 20}}>Target Words: {filteredElements}</Text>
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
    </Text>
  );
};

export default SatoriLine;
