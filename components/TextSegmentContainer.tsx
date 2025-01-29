import React, {Text} from 'react-native';
import TextSegmentWithWordOverlap from './TextSegmentWithWordOverlap';
import {getHexCode} from '../utils/get-hex-code';

const TextSegmentContainer = ({
  textSegments,
  wordsInOverlapCheck,
  matchedWordListState,
}) => {
  return (
    <Text>
      {textSegments.map((segment, index) => {
        const isPartOfPerfectlyMatchedWord = wordsInOverlapCheck?.find(
          item =>
            item.surfaceForm === segment.text || item.baseForm === segment.text,
        );
        const isPartOfMatchedWordIndex = wordsInOverlapCheck?.findIndex(
          item =>
            item.surfaceForm === segment.text || item.baseForm === segment.text,
        );

        const thisWordsNestedWords =
          isPartOfPerfectlyMatchedWord &&
          wordsInOverlapCheck?.filter(
            item => item?.nestedIn === isPartOfPerfectlyMatchedWord?.id,
          );

        const nestedCoordinates = thisWordsNestedWords?.map(item => {
          const nestedValueIndex = matchedWordListState.find(nestedItem => {
            if (
              nestedItem.surfaceForm === item.surfaceForm ||
              nestedItem.baseForm === item.baseForm
            ) {
              return true;
            }
            return false;
          });
          return nestedValueIndex.colorIndex;
        });

        return (
          <Text
            key={index}
            id={segment.id}
            selectable={true}
            style={[
              segment.style,
              {
                fontSize: 20,
                lineHeight: nestedCoordinates?.length === 0 && 24,
                color:
                  nestedCoordinates?.length === 0 &&
                  isPartOfMatchedWordIndex > -1
                    ? getHexCode(isPartOfPerfectlyMatchedWord.colorIndex)
                    : 'black',
              },
            ]}>
            {nestedCoordinates?.length > 0 ? (
              <TextSegmentWithWordOverlap
                segment={segment}
                nestedCoordinates={nestedCoordinates}
                colorIndex={isPartOfPerfectlyMatchedWord.colorIndex}
              />
            ) : (
              segment.text
            )}
          </Text>
        );
      })}
    </Text>
  );
};

export default TextSegmentContainer;
