import React, {useEffect, useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';

import AnimatedWordModal from './WordModal';
import SRSToggles from './SRSToggles';
import {PillButtonScaled} from './PillButton';
import {sortByDueDateWords} from '../utils/sort-by-due-date';

const SelectedTopicWordsSection = ({
  selectedTopicWords,
  selectedWordState,
  setSelectedWordState,
  handleDeleteWord,
  selectedTopic,
  setSelectedTopic,
}) => {
  const [flashcardState, setFlashcardState] = useState([]);
  const [isShowOptionA, setIsShowOptionA] = useState(true);
  const {width} = Dimensions?.get('window');

  const handleToggleDueState = () => {
    if (isShowOptionA) {
      const sortedFlashCards = [...selectedTopicWords].sort(sortByDueDateWords);
      setFlashcardState(sortedFlashCards);
      setIsShowOptionA(false);
    } else {
      setFlashcardState(selectedTopicWords);
      setIsShowOptionA(true);
    }
  };

  const addToConbinedWords = () => {};

  useEffect(() => {
    setFlashcardState(selectedTopicWords);
  }, [selectedTopicWords]);

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
          toggleOption={() => handleToggleDueState()}
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
        {flashcardState?.map((wordData, index) => {
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
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'green',
                  padding: 5,
                  marginVertical: 5,
                  borderRadius: 10,
                }}>
                <TouchableOpacity onPress={addToConbinedWords}>
                  <Text>Add to 🗑️</Text>
                </TouchableOpacity>
              </View>

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
