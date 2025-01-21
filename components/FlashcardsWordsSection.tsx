import React, {useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import AnimatedWordModal from './WordModal';
import {SRSTogglesQuickComprehensive} from './SRSToggles';

export const FlashCardsSectionContainer = ({
  handleDeleteWordFlashCard,
  dueCardsState,
  tempNewStudyCardsState,
}) => {
  const isTemp = tempNewStudyCardsState?.length > 0;
  const flashCards = isTemp ? tempNewStudyCardsState : dueCardsState;
  return (
    <FlashcardsWordsSection
      dueCardsState={flashCards}
      handleDeleteWord={handleDeleteWordFlashCard}
      isTempWord={isTemp}
    />
  );
};

const FlashcardsWordsSection = ({
  dueCardsState,
  handleDeleteWord,
  isTempWord,
}) => {
  const [selectedDueCardState, setSelectedDueCardState] = useState();
  const {width} = Dimensions?.get('window');

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
      }}>
      {dueCardsState?.map((wordData, index) => {
        const listTextNumber = index + 1 + ') ';
        const wordId = wordData.id;
        const isSelectedWord = selectedDueCardState?.id === wordId;
        const baseForm = wordData.baseForm;

        return (
          <View
            key={wordId}
            style={{
              borderBlockColor: 'black',
              borderWidth: 2,
              padding: 5,
              borderRadius: 5,
              width: isSelectedWord ? width * 0.9 : 'auto',
            }}>
            <TouchableOpacity
              style={{
                borderBottomWidth: 1,
                paddingBottom: 5,
              }}
              onPress={() => setSelectedDueCardState(wordData)}>
              <Text
                style={{
                  fontSize: 24,
                }}>
                {listTextNumber}
                {baseForm}
              </Text>
            </TouchableOpacity>
            {!isSelectedWord && (
              <SRSTogglesQuickComprehensive
                reviewData={wordData.reviewData}
                id={wordId}
                baseForm={baseForm}
                isTempWord={isTempWord}
                deleteWord={() => handleDeleteWord(wordData)}
              />
            )}
            {isSelectedWord && (
              <AnimatedWordModal
                visible={wordData}
                onClose={() => setSelectedDueCardState(null)}
                deleteWord={() => handleDeleteWord(wordData)}
                isTempWord={isTempWord}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default FlashcardsWordsSection;
