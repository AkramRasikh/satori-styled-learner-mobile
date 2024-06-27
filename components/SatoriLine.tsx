import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import HighlightTextZone from './HighlightTextZone';

const filterElementsById = (elements, targetId) => {
  const filteredElements = React.Children.toArray(elements).filter(
    element => React.isValidElement(element) && element.props.id === targetId,
  );
  // Map filtered elements to strings
  const elementTexts = filteredElements.map(element => element.props.children);

  // Join strings with ', '
  return elementTexts.join(', ');
};

const SatoriLine = ({
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
}) => {
  const [showEng, setShowEng] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const safeText = getSafeText(topicSentence.targetLang);

  const filteredElements = filterElementsById(safeText, 'targetWord');

  return (
    <Text
      selectable={true}
      style={{
        backgroundColor: focusThisSentence ? 'yellow' : 'transparent',
      }}>
      <TouchableOpacity onPress={() => playFromThisSentence(topicSentence.id)}>
        <Text style={{marginRight: 5}}>▶️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowEng(!showEng)}>
        <Text style={{marginRight: 5}}>🇬🇧</Text>
      </TouchableOpacity>
      {topicSentence.notes ? (
        <TouchableOpacity onPress={() => setShowNotes(!showNotes)}>
          <Text style={{marginRight: 5}}>☝🏽</Text>
        </TouchableOpacity>
      ) : null}
      {englishOnly ? null : highlightMode ? (
        <HighlightTextZone
          sentenceIndex={sentenceIndex}
          text={topicSentence.targetLang}
          highlightedIndices={highlightedIndices}
          setHighlightedIndices={setHighlightedIndices}
        />
      ) : (
        safeText
      )}
      {showEng || englishOnly ? (
        <Text selectable={true}>{topicSentence.baseLang}</Text>
      ) : null}
      {showNotes ? <Text>{topicSentence.notes}</Text> : null}
      {wordTest && filteredElements.length > 0 ? (
        <View
          style={{
            paddingTop: 10,
            width: '100%', // Takes the full width of the parent
          }}>
          <Text style={{fontSize: 20}}>Target Words: {filteredElements}</Text>
        </View>
      ) : wordTest && filteredElements.length === 0 ? (
        <View
          style={{
            paddingTop: 10,
            width: '100%', // Takes the full width of the parent
          }}>
          <Text style={{fontSize: 20}}>No words</Text>
        </View>
      ) : null}
    </Text>
  );
};

export default SatoriLine;
