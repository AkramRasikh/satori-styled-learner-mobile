import Clipboard from '@react-native-clipboard/clipboard';
import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import useOpenGoogleTranslate from '../hooks/useOpenGoogleTranslate';

const dimensionalWidth = Dimensions.get('window').width;

const HighlightTextZone = ({
  id,
  text,
  highlightedIndices,
  setHighlightedIndices,
  saveWordFirebase,
  setHighlightMode,
  setIsSettingsOpenState,
  handleQuickGoogleTranslate,
  onHighlightedMount,
  onHighlightedUnMount,
}) => {
  const highlightContainerRef = useRef(null);
  const culminativeWidthState = useRef([]);
  const lineIndex = useRef([]);
  const arrOfWidths = useRef([]);
  const onInitPressed = useRef(null);
  const groupedArrays = useRef([]);
  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const getFlattenedKey = (subarrayKey, index) => {
    let cumulativeLength = 0;
    for (let i = 0; i < subarrayKey; i++) {
      cumulativeLength += groupedArrays.current[i].length;
    }

    return cumulativeLength + index;
  };

  const getHighlightedText = () => {
    if (highlightedIndices.length === 0) {
      return '';
    }
    let targetText = '';

    text.split('').forEach((char, index) => {
      const isInHighlighted = highlightedIndices.includes(index);

      if (isInHighlighted) {
        targetText = targetText + char;
      }
    });

    return targetText;
  };

  const createArrayBetween = startEndArr => {
    const [start, end] = startEndArr;

    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  const getIndexFromGroupedArr = (subarrayKey, pageX) => {
    const subarray = groupedArrays.current[subarrayKey];
    const index = subarray.findIndex(value => value >= pageX);

    if (index === -1) {
      return null;
    }

    const flattenedKey = getFlattenedKey(subarrayKey, index);

    setHighlightedIndices(
      createArrayBetween(
        [onInitPressed.current, flattenedKey].sort((a, b) => a - b),
      ),
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: () => {
        onHighlightedUnMount?.();
      },
      onPanResponderGrant: () => {
        onHighlightedMount?.();
      },
      onPanResponderMove: evt => {
        const pageY = evt.nativeEvent.pageY;
        const movingPageX = evt.nativeEvent.pageX;

        highlightContainerRef?.current.measure(
          (x, y, width, height, pageX, initPageY) => {
            const line = Math.floor((pageY - initPageY) / 24);
            const maxLines = height / 24;

            const passedLines =
              line >= maxLines ? maxLines - 1 : line < 0 ? 0 : line;
            getIndexFromGroupedArr(passedLines, movingPageX);
          },
        );
      },
    }),
  ).current;

  const handleClose = () => {
    setHighlightedIndices([]);
    setHighlightMode(false);
    setIsSettingsOpenState?.();
  };

  const handleOpenUpGoogle = () => {
    openGoogleTranslateApp(getHighlightedText() || text);
  };

  const handleCopyText = () => {
    const highlightedText = getHighlightedText();
    if (highlightedText) {
      Clipboard.setString(highlightedText);
      setHighlightedIndices([]);
    }
  };

  const handleSaveWord = isGoogle => {
    const highlightedText = getHighlightedText();
    if (highlightedText) {
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

  const groupByLine = (lineIndex, culminativeWidths) => {
    let result = [];
    let currentLine = -1;
    let lineStartWidth = 0;
    let additionalInitSpace =
      arrOfWidths.current[0] +
      (dimensionalWidth - highlightContainerRef.current.width);
    lineIndex.forEach((line, index) => {
      if (line !== currentLine) {
        result.push([]);
        currentLine = line;
        lineStartWidth = culminativeWidths[index];
        additionalInitSpace = arrOfWidths.current[index];
      }

      result[result.length - 1].push(
        culminativeWidths[index] - lineStartWidth + additionalInitSpace,
      );
    });

    groupedArrays.current = result;
  };

  // Render the text with highlighting
  const renderText = text => {
    const splitText = text.split('');

    let arr = [];

    return splitText.map((char, index) => {
      const isHighlightedChar = highlightedIndices.includes(index);
      const isLast = splitText.length === index + 1;
      return (
        <TouchableWithoutFeedback
          key={index}
          onPressIn={() => {
            onInitPressed.current = index;
            setHighlightedIndices([index]);
          }}>
          <Text
            style={{
              fontSize: 20,
              lineHeight: 24,
              backgroundColor: isHighlightedChar ? '#add8e6' : 'transparent',
            }}
            onLayout={eee => {
              const thisCharY = eee.nativeEvent.layout.y;
              const thisCharWidth = eee.nativeEvent.layout.width;
              const thisLineNumber = thisCharY / 24;

              if (lineIndex.current.length <= index) {
                lineIndex.current.push(thisLineNumber);
                arr.push(thisCharWidth);
                arrOfWidths.current.push(thisCharWidth);
              }

              if (isLast) {
                culminativeWidthState.current = arr.map(
                  (
                    sum => num =>
                      (sum += num)
                  )(0),
                );

                groupByLine(lineIndex.current, culminativeWidthState.current);
              }
            }}>
            {char}
          </Text>
        </TouchableWithoutFeedback>
      );
    });
  };

  return (
    <View>
      {highlightedIndices?.length > 0 ? (
        <View
          style={{
            position: 'absolute',
            bottom: 100,
            backgroundColor: '#FFFFC5',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 4,
            alignSelf: 'center',
          }}>
          <Text style={{fontSize: 20}}>{getHighlightedText()}</Text>
        </View>
      ) : null}
      <View
        {...panResponder.panHandlers}
        ref={highlightContainerRef}
        style={styles.text}>
        {renderText(text)}
      </View>
      <View>
        {highlightedIndices?.length === 0 ? (
          <TouchableOpacity onPress={handleClose}>
            <Text>❌</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {highlightedIndices?.length > 0 ? (
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
                await handleQuickGoogleTranslate(getHighlightedText())
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
