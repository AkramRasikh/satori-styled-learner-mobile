import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  PanResponder,
  Modal,
} from 'react-native';

const TextInputcomp = () => {
  const text = '昨日の夜、友達と一緒に映画を見に行きました';
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

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
  console.log('## extractHighlightedText: ', {highlightedText});

  // Estimate the character index based on the x-coordinate
  const calculateIndex = x => {
    // Adjust this value based on actual character width in your font
    const charWidth = 16;
    return Math.floor(x / charWidth);
  };

  const copyToClipboard = word => {
    Alert.alert('Copied to clipboard!');
  };

  const handleContextMenuAction = index => {
    switch (index) {
      case 0: // Copy
        // copyToClipboard(word);
        break;
      default:
        break;
    }
    setModalVisible(false);
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

  // Function to handle clipboard actions
  const handlePress = () => {};

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <TouchableOpacity onLongPress={handlePress}>
        <Text style={styles.text}>{renderText(text)}</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => handleContextMenuAction(0)}>
            <Text style={styles.modalOption} onPress={copyToClipboard}>
              Copy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleContextMenuAction(1)}>
            <Text style={styles.modalOption}>Translate</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={styles.modalOption}>Cancel</Text>
        </TouchableOpacity> */}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  normal: {
    fontSize: 16,
    lineHeight: 24,
  },
  highlight: {
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: '#ffff00',
  },
  modalOption: {
    fontSize: 18,
    marginVertical: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default TextInputcomp;
