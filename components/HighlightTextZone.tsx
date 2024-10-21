import Clipboard from '@react-native-clipboard/clipboard';
import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import useOpenGoogleTranslate from './useOpenGoogleTranslate';

const HighlightTextZone = ({
  id,
  text,
  highlightedIndices,
  setHighlightedIndices,
  sentenceIndex,
  saveWordFirebase,
  setHighlightMode,
  textWidth,
}) => {
  const startRef = useRef(null);
  const [initialLineLocationY, setInitialLineLocationY] = useState(null);
  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const sentencePrefix = sentenceIndex + '-';

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        if (evt.nativeEvent.locationY && evt.nativeEvent.locationX) {
          const numberOfLines = Math.floor(evt.nativeEvent.locationY / 24);
          const linesToMoreWidth = numberOfLines * textWidth * 0.9;
          setInitialLineLocationY(evt.nativeEvent.locationY);
          const currentIndex = calculateIndexX(
            evt.nativeEvent.locationX + linesToMoreWidth,
          );
          startRef.current = currentIndex;
          setHighlightedIndices([sentencePrefix + startRef.current]);
        }
      },
      onPanResponderMove: evt => {
        if (evt.nativeEvent.locationY && evt.nativeEvent.locationX) {
          const numberOfLines = Math.floor(
            (evt.nativeEvent.locationY - initialLineLocationY) / 24,
          );
          const linesToMoreWidth = numberOfLines * textWidth * 0.9;
          const currentIndex = calculateIndexX(
            evt.nativeEvent.locationX + linesToMoreWidth,
          );
          updateHighlightedIndices(sentencePrefix + currentIndex);
        }
      },
    }),
  ).current;

  const extractHighlightedText = (sentence, indices) => {
    if (indices?.length === 0) {
      return '';
    }
    const chars = sentence.split('');
    const [firstCharacter] = indices[0].split('-');
    const isThisSentenceHighlighted = Number(firstCharacter) === sentenceIndex;
    if (!isThisSentenceHighlighted) {
      return '';
    }

    const mappedIndices = indices
      .map(index => {
        const [_, indexKey] = index.split('-');
        return chars[indexKey];
      })
      .join('');

    return mappedIndices;
  };

  const highlightedText = extractHighlightedText(text, highlightedIndices);

  const handleOpenUpGoogle = () => {
    openGoogleTranslateApp(highlightedText || text);
  };

  // Estimate the character index based on the x-coordinate
  const calculateIndexX = x => {
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
        contextSentence: text,
      });
      setHighlightedIndices([]);
      setHighlightMode(false);
    }
  };

  // Update the highlighted indices based on the drag range
  const updateHighlightedIndices = currentIndex => {
    const [firstCharacter, secondCharacter] = currentIndex?.split('-');

    const isThisSentenceHighlighted = Number(firstCharacter) === sentenceIndex;

    if (startRef.current !== null && isThisSentenceHighlighted) {
      const startIndex = Math.min(startRef.current, secondCharacter);
      const endIndex = Math.max(startRef.current, secondCharacter);
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
            highlightedIndices.includes(sentencePrefix + index) &&
            styles.highlight
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
              <TouchableOpacity onPress={handleOpenUpGoogle}>
                <Text>📚</Text>
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
  highlight: {
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: '#add8e6',
  },
});

export default HighlightTextZone;
