import React, {useEffect, useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';

import AnimatedWordModal from './WordModal';
import SRSToggles from './SRSToggles';
import {PillButtonScaled} from './PillButton';

const SelectedTopicWordsSection = ({
  selectedTopicWords,
  selectedWordState,
  setSelectedWordState,
  handleDeleteWord,
  selectedTopic,
  setSelectedTopic,
}) => {
  const [isShowOptionA, setIsShowOptionA] = useState(false);
  const {width} = Dimensions?.get('window');

  useEffect(() => {
    // isShowOptionA show in due order state
  }, []);

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
          flexWrap: 'wrap',
        }}>
        <View
          style={{
            alignSelf: 'center',
          }}>
          <Text>{selectedTopic}:</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: 'gray',
            padding: 5,
            borderRadius: 5,
          }}
          onPress={() => setSelectedTopic('')}>
          <Text>Other Topics</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginBottom: 10,
          alignItems: 'center',
        }}>
        <PillButtonScaled
          isShowOptionA={isShowOptionA}
          toggleOption={() => setIsShowOptionA(!isShowOptionA)}
          textA={'Default'}
          textB={'Due order'}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 5,
        }}>
        {selectedTopicWords?.map((wordData, index) => {
          const listTextNumber = index + 1 + ') ';
          const wordId = wordData.id;
          const isSelectedWord = selectedWordState?.id === wordId;
          const isCardDue = wordData?.isCardDue;
          const baseForm = wordData?.baseForm;
          const cardReviewButNotDue = !isCardDue && wordData?.reviewData?.due;

          return (
            <View
              key={wordData.id}
              style={{
                borderBlockColor: 'black',
                borderWidth: 2,
                padding: 5,
                borderRadius: 5,
                width: isSelectedWord ? width * 0.9 : 'auto',
                backgroundColor: cardReviewButNotDue
                  ? '#ADD8E6'
                  : isCardDue && 'pink',
              }}>
              <TouchableOpacity onPress={() => setSelectedWordState(wordData)}>
                <Text
                  style={{
                    fontSize: 24,
                  }}>
                  {listTextNumber}
                  {wordData.baseForm}
                </Text>
              </TouchableOpacity>
              {!isSelectedWord && (
                <SRSToggles
                  reviewData={wordData.reviewData}
                  id={wordId}
                  baseForm={baseForm}
                  limitedOptionsMode
                />
              )}
              {isSelectedWord && (
                <AnimatedWordModal
                  visible={wordData}
                  onClose={() => setSelectedWordState(null)}
                  deleteWord={handleDeleteWord}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};
export default SelectedTopicWordsSection;
