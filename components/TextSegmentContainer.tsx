import React, {Text, View} from 'react-native';
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

        const showPhoneticHint =
          isPartOfPerfectlyMatchedWord?.phonetic !==
            isPartOfPerfectlyMatchedWord?.baseForm ||
          isPartOfPerfectlyMatchedWord?.phonetic !==
            isPartOfPerfectlyMatchedWord?.surface;

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
            ) : showPhoneticHint ? (
              <View style={{height: 32}}>
                <Text
                  style={{
                    fontSize: 10,
                    color: getHexCode(isPartOfPerfectlyMatchedWord.colorIndex),
                    marginHorizontal: 'auto',
                    marginBottom: 2,
                  }}>
                  {isPartOfPerfectlyMatchedWord.phonetic}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: getHexCode(isPartOfPerfectlyMatchedWord.colorIndex),
                    marginHorizontal: 'auto',
                    marginVertical: 'auto',
                  }}>
                  {segment.text}
                </Text>
              </View>
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
