import Clipboard from '@react-native-clipboard/clipboard';
import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
  Image,
} from 'react-native';
import useOpenGoogleTranslate from '../hooks/useOpenGoogleTranslate';

const HighlightTextZone = ({
  id,
  text,
  highlightedIndices,
  setHighlightedIndices,
  sentenceIndex,
  saveWordFirebase,
  setHighlightMode,
  setIsSettingsOpenState,
  handleQuickGoogleTranslate,
  onHighlightedMount,
  onHighlightedUnMount,
}) => {
  const textWidthRef = useRef(0);
  const textHeightRef = useRef(0);
  // const highlightContainerRef = useRef(null);

  const startRef = useRef(null);
  const [initialLineLocationY, setInitialLineLocationY] = useState(null);
  // const [charArrWidthState, setCharArrWidthState] = useState([]);
  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const sentencePrefix = sentenceIndex + '-';

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        if (evt.nativeEvent.locationY && evt.nativeEvent.locationX) {
          const currentLine = Math.floor(evt.nativeEvent.locationY / 24);
          const linesToMoreWidth = currentLine * textWidthRef.current;
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
          const currentLine = Math.floor(
            (evt.nativeEvent.locationY - initialLineLocationY) / 24,
          );
          const linesToMoreWidth = currentLine * textWidthRef.current;

          const currentIndex = calculateIndexX(
            evt.nativeEvent.locationX + linesToMoreWidth,
          );
          updateHighlightedIndices(sentencePrefix + currentIndex);
        }
      },
    }),
  ).current;

  useEffect(() => {
    onHighlightedMount?.();

    return () => {
      onHighlightedUnMount?.();
    };
  }, []);

  const handleClose = () => {
    setHighlightedIndices([]);
    setHighlightMode(false);
    setIsSettingsOpenState?.();
  };

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
    const charWidth = 20;
    return Math.floor(x / charWidth);
  };

  const handleCopyText = () => {
    if (highlightedText?.length > 0) {
      Clipboard.setString(highlightedText);
      setHighlightedIndices([]);
    }
  };

  const handleSaveWord = isGoogle => {
    if (highlightedText?.length > 0) {
      saveWordFirebase({
        highlightedWord: highlightedText,
        highlightedWordSentenceId: id,
        contextSentence: text,
        isGoogle,
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
      const isHighlightedChar = highlightedIndices.includes(
        sentencePrefix + index,
      );
      // const isLast = splitText.length === index + 1;
      return (
        <Text
          key={index}
          style={{
            fontSize: 20,
            lineHeight: 24,
            backgroundColor: isHighlightedChar ? '#add8e6' : 'transparent',
          }}
          // onTextLayout={event => {
          //   const thisCharWidth = event.nativeEvent.lines[0].width;

          //   if (charArrWidthState.length < index) {
          //     const updatedChar = [...charArrWidthState, thisCharWidth];
          //     setCharArrWidthState(updatedChar);
          //     if (isLast) {
          //       setCulminativeWidthState(
          //         updatedChar.map(
          //           (
          //             sum => num =>
          //               (sum += num)
          //           )(0),
          //         ),
          //       );
          //     }
          //   }
          // }}
        >
          {char}
        </Text>
      );
    });
  };

  return (
    <View>
      <Text
        {...panResponder.panHandlers}
        // ref={highlightContainerRef}
        style={styles.text}
        onLayout={event => {
          const {width, height} = event.nativeEvent.layout;
          textWidthRef.current = width;
          textHeightRef.current = height;
        }}>
        {renderText(text)}
        {highlightedText?.length === 0 ? (
          <TouchableOpacity onPress={handleClose}>
            <Text>❌</Text>
          </TouchableOpacity>
        ) : null}
      </Text>
      {highlightedText?.length > 0 ? (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 15,
            marginTop: 10,
          }}>
          <TouchableOpacity onPress={handleClose}>
            <Text>❌</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCopyText}>
            <Text>📋</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenUpGoogle}>
            <Text>📚</Text>
          </TouchableOpacity>
          {handleQuickGoogleTranslate && (
            <TouchableOpacity
              onPress={async () =>
                await handleQuickGoogleTranslate(highlightedText)
              }>
              <Text>💨</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleSaveWord(true)}>
            <Image
              source={require('../assets/images/google.png')}
              style={{width: 16, height: 16}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSaveWord(false)}>
            <Image
              source={require('../assets/images/chatgpt.png')}
              style={{width: 16, height: 16}}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    lineHeight: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: '#00008B',
  },
});

export default HighlightTextZone;
