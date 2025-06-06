import React, {useEffect, useRef} from 'react';
import {
  Dimensions,
  PanResponder,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {DefaultTheme, Text} from 'react-native-paper';

const dimensionalWidth = Dimensions.get('window').width;

const HighlightTextAreaArabic = ({
  onHighlightedMount,
  onHighlightedUnMount,
  setHighlightedIndices,
  highlightedIndices,
  handleClose,
  text,
  reversedArabicTextState,
  setReversedArabicTextState,
}) => {
  const highlightContainerRef = useRef(null);
  const culminativeWidthState = useRef([]);
  const lineIndex = useRef([]);
  const arrOfWidths = useRef([]);
  const onInitPressed = useRef(null);
  const groupedArrays = useRef([]);
  const matrixLinesIndex = useRef([]);
  const reversedStateWorking = useRef(null);

  reversedStateWorking.current = Boolean(reversedArabicTextState);

  const splitText = text.split(/([\s.]+)/);

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

  useEffect(() => {
    if (highlightContainerRef.current) {
      setTimeout(
        () =>
          highlightContainerRef.current.measure(
            (x, y, width, height, pageX, pageY) => {
              const line = Math.floor((pageY - pageY) / 24);
              const maxLines = height / 24;

              const passedLines =
                line >= maxLines ? maxLines - 1 : line < 0 ? 0 : line;
              getIndexFromGroupedArr(passedLines, 0);
            },
          ),
        0,
      );
    }
  }, [highlightContainerRef]);

  useEffect(() => {
    return () => {
      onHighlightedUnMount?.(); // not sure if i still need the other
    };
  }, []);

  const createArrayBetween = startEndArr => {
    const [start, end] = startEndArr;

    if (reversedStateWorking.current) {
      const {
        sameArr,
        startArrayIndex,
        endArrayIndex,
        squashedSubSectionArrays,
      } = areStartAndEndInDifferentArrays(start, end, matrixLinesIndex.current);

      if (sameArr) {
        const result = [];
        for (let i = start; i <= end; i++) {
          result.push(i);
        }

        return result;
      } else if (startArrayIndex !== -1 && endArrayIndex !== -1) {
        const filterInitialLine = matrixLinesIndex.current[
          startArrayIndex
        ].filter(item => item <= start);
        const filterlastLine = matrixLinesIndex.current[endArrayIndex].filter(
          item => item >= end,
        );

        return [
          ...filterInitialLine,
          ...squashedSubSectionArrays,
          ...filterlastLine,
        ];
      }
    }

    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  const areStartAndEndInDifferentArrays = (start, end, matrix) => {
    let startArrayIndex = -1;
    let endArrayIndex = -1;

    // Iterate through the matrix to find the indices of the arrays containing start and end
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i].includes(start)) {
        startArrayIndex = i;
      }
      if (matrix[i].includes(end)) {
        endArrayIndex = i;
      }
    }

    const sameArr =
      startArrayIndex !== -1 &&
      endArrayIndex !== -1 &&
      startArrayIndex === endArrayIndex;

    let squashedSubSectionArrays = [];
    if (!sameArr && startArrayIndex !== -1 && endArrayIndex !== -1) {
      const startIndex = Math.min(startArrayIndex, endArrayIndex) + 1;
      const endIndex = Math.max(startArrayIndex, endArrayIndex) - 1;

      for (let i = startIndex; i <= endIndex; i++) {
        squashedSubSectionArrays = squashedSubSectionArrays.concat(matrix[i]);
      }
    }

    return {
      sameArr,
      startArrayIndex,
      endArrayIndex,
      squashedSubSectionArrays,
    };
  };

  const getFlattenedKey = (subarrayKey, index) => {
    let cumulativeLength = 0;
    for (let i = 0; i < subarrayKey; i++) {
      cumulativeLength += groupedArrays.current[i].length;
    }

    return cumulativeLength + index;
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

  const groupByLine = (lineIndex, culminativeWidths) => {
    let result = [];
    let indexOfChars = [];
    let currentLine = -1;
    let lineStartWidth = 0;
    let additionalInitSpace =
      arrOfWidths.current[0] +
      (dimensionalWidth - highlightContainerRef.current.width);
    lineIndex.forEach((line, index) => {
      if (line !== currentLine) {
        result.push([]);
        indexOfChars.push([]);
        currentLine = line;
        lineStartWidth = culminativeWidths[index];
        additionalInitSpace = arrOfWidths.current[index];
      }

      indexOfChars[indexOfChars.length - 1].push(index);
      result[result.length - 1].push(
        culminativeWidths[index] - lineStartWidth + additionalInitSpace,
      );
    });

    if (!reversedArabicTextState) {
      matrixLinesIndex.current = indexOfChars.map(i => i.reverse());
    }

    groupedArrays.current = result;
  };

  useEffect(() => {
    if (
      groupedArrays.current.length > 0 &&
      matrixLinesIndex.current.length === groupedArrays.current.length &&
      splitText.length === groupedArrays.current.flat().length &&
      !reversedArabicTextState
    ) {
      const flattenMatrixArray = matrixLinesIndex.current.flat();
      setReversedArabicTextState(
        flattenMatrixArray.map(itemIndex => splitText[itemIndex]).join(''),
      );

      onInitPressed.current = null;
      lineIndex.current = [];
      culminativeWidthState.current = [];
      arrOfWidths.current = [];
      groupedArrays.current = [];
    }
  }, [
    splitText,
    groupedArrays,
    matrixLinesIndex,
    reversedArabicTextState,
    onInitPressed,
    lineIndex,
    culminativeWidthState,
    arrOfWidths,
  ]);

  // Render the text with highlighting
  const renderText = () => {
    let arr = [];

    if (reversedArabicTextState) {
      const splitReversed = reversedArabicTextState.split(/([\s.]+)/);
      return splitReversed.map((char, index) => {
        const isHighlightedChar = highlightedIndices.includes(index);
        const isLast = splitReversed.length === index + 1;
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
                color: DefaultTheme.colors.tertiary,
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
    }

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
      <View
        style={{
          marginRight: 10,
        }}>
        <View
          {...panResponder.panHandlers}
          ref={highlightContainerRef}
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {renderText()}
        </View>
      </View>
      <View>
        {highlightedIndices?.length === 0 ? (
          <TouchableOpacity onPress={handleClose}>
            <Text>❌</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default HighlightTextAreaArabic;
