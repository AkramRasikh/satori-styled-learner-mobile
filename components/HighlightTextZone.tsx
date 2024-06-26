import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const HighlightTextZone = ({
  text = '昨日の夜、友達と一緒に映画を見に行きました',
}) => {
  const [highlightedIndices, setHighlightedIndices] = useState([]);

  const startRef = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        startRef.current = calculateIndex(evt.nativeEvent.locationX);
        setHighlightedIndices([startRef.current]);
      },
      onPanResponderMove: evt => {
        const currentIndex = calculateIndex(evt.nativeEvent.locationX);
        updateHighlightedIndices(currentIndex);
      },
    }),
  ).current;

  const extractHighlightedText = (sentence, indices) => {
    const chars = sentence.split('');
    return indices.map(index => chars[index]).join('');
  };

  const highlightedText = extractHighlightedText(text, highlightedIndices);

  // Estimate the character index based on the x-coordinate
  const calculateIndex = x => {
    // Adjust this value based on actual character width in your font
    const charWidth = 16;
    return Math.floor(x / charWidth);
  };

  const handleShortenSnippet = async () => {
    Clipboard.setString(highlightedText);
  };

  // Update the highlighted indices based on the drag range
  const updateHighlightedIndices = currentIndex => {
    if (startRef.current !== null) {
      const startIndex = Math.min(startRef.current, currentIndex);
      const endIndex = Math.max(startRef.current, currentIndex);
      const indices = [];
      for (let i = startIndex; i <= endIndex; i++) {
        indices.push(i);
      }
      setHighlightedIndices(indices);
    }
  };

  // Render the text with highlighting
  const renderText = text => {
    const splitText = text.split('');

    return splitText.map((char, index) => (
      <Text
        key={index}
        style={
          highlightedIndices.includes(index) ? styles.highlight : styles.normal
        }>
        {char}
      </Text>
    ));
  };

  const hasHighlightedText = highlightedIndices?.length > 0;

  return (
    <View>
      <View {...panResponder.panHandlers}>
        <TouchableOpacity>
          <Text style={styles.text}>{renderText(text)}</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          opacity: hasHighlightedText ? 1 : 0.2,
          borderRadius: 10,
          alignSelf: 'flex-start',
        }}>
        <TouchableOpacity
          disabled={!hasHighlightedText}
          onPress={() => handleShortenSnippet()}>
          <Text style={styles.modalOption}>📋</Text>
        </TouchableOpacity>
      </View>
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
