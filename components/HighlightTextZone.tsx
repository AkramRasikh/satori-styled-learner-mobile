import Clipboard from '@react-native-clipboard/clipboard';
import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
} from 'react-native';

const HighlightTextZone = ({
  id,
  text,
  highlightedIndices,
  setHighlightedIndices,
  sentenceIndex,
  saveWordFirebase,
}) => {
  const startRef = useRef(null);

  const sentencePrefix = sentenceIndex + '-';

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        startRef.current = calculateIndex(evt.nativeEvent.locationX);
        setHighlightedIndices([sentencePrefix + startRef.current]);
      },
      onPanResponderMove: evt => {
        const currentIndex = calculateIndex(evt.nativeEvent.locationX);
        updateHighlightedIndices(sentencePrefix + currentIndex);
      },
    }),
  ).current;

  const extractHighlightedText = (sentence, indices) => {
    if (indices?.length === 0) {
      return '';
    }
    const chars = sentence.split('');
    const firstCharacter = indices[0]?.substring(0, 2);
    const isThisSentenceHighlighted = firstCharacter === sentencePrefix;
    if (!isThisSentenceHighlighted) {
      return '';
    }
    const mappedIndices = indices
      .map(index => {
        return chars[index.slice(2)];
      })
      .join('');
    return mappedIndices;
  };

  const highlightedText = extractHighlightedText(text, highlightedIndices);

  // Estimate the character index based on the x-coordinate
  const calculateIndex = x => {
    // Adjust this value based on actual character width in your font
    const charWidth = 16;
    return Math.floor(x / charWidth);
  };

  const handleCopyText = () => {
    if (highlightedText?.length > 0) {
      Clipboard.setString(highlightedText);
      setHighlightedIndices([]);
    }
  };

  const handleSaveWord = () => {
    if (highlightedText?.length > 0) {
      saveWordFirebase({
        highlightedWord: highlightedText,
        highlightedWordSentenceId: id,
      });
      setHighlightedIndices([]);
    }
  };

  // Update the highlighted indices based on the drag range
  const updateHighlightedIndices = currentIndex => {
    const firstCharacter = currentIndex?.slice(0, 2);

    const isThisSentenceHighlighted = firstCharacter === sentencePrefix;

    if (startRef.current !== null && isThisSentenceHighlighted) {
      const slicedIndex = currentIndex.slice(2);
      const startIndex = Math.min(startRef.current, slicedIndex);
      const endIndex = Math.max(startRef.current, slicedIndex);
      const indices = [];
      for (let i = startIndex; i <= endIndex; i++) {
        indices.push(sentenceIndex + '-' + i);
      }
      setHighlightedIndices(indices);
    }
  };

  // Render the text with highlighting
  const renderText = text => {
    const splitText = text.split('');

    return splitText.map((char, index) => {
      return (
        <Text
          key={index}
          style={
            highlightedIndices.includes(sentencePrefix + index)
              ? styles.highlight
              : styles.normal
          }>
          {char}
        </Text>
      );
    });
  };

  return (
    <View {...panResponder.panHandlers}>
      <TouchableOpacity>
        <Text style={styles.text}>
          {renderText(text)}{' '}
          {highlightedText?.length > 0 ? (
            <>
              <TouchableOpacity onPress={handleCopyText}>
                <Text>📋</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveWord}>
                <Text>📖</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  normal: {
    fontSize: 16,
  },
  highlight: {
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: '#add8e6',
  },
  modalOption: {
    fontSize: 18,
    padding: 5,
  },
});

export default HighlightTextZone;
