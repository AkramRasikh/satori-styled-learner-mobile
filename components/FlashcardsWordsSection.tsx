import React, {useState} from 'react';
import {Button, Dimensions, Text, TouchableOpacity, View} from 'react-native';
import AnimatedWordModal from './WordModal';
import {SRSTogglesQuickComprehensive} from './SRSToggles';

export const FlashCardsSectionContainer = ({
  handleDeleteWordFlashCard,
  dueCardsState,
  handleExpandWordArray,
  sliceArrState,
  realCapacity,
}) => {
  return (
    <FlashcardsWordsSection
      dueCardsState={dueCardsState}
      handleDeleteWord={handleDeleteWordFlashCard}
      handleExpandWordArray={handleExpandWordArray}
      sliceArrState={sliceArrState}
      realCapacity={realCapacity}
    />
  );
};

const FlashcardsWordsSection = ({
  dueCardsState,
  handleDeleteWord,
  handleExpandWordArray,
  sliceArrState,
  realCapacity,
}) => {
  const [selectedDueCardState, setSelectedDueCardState] = useState();
  const {width} = Dimensions?.get('window');

  const handleCloseModal = () => {
    setSelectedDueCardState(null);
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
      }}>
      {dueCardsState?.map((wordData, index) => {
        const isLastEl = dueCardsState.length === index + 1;
        const listTextNumber = index + 1 + ') ';
        const wordId = wordData.id;
        const isSelectedWord = selectedDueCardState?.id === wordId;
        const baseForm = wordData.baseForm;
        const isLastInTotalOrder = realCapacity === index + 1;
        const isCardDue = wordData?.isCardDue;
        const cardReviewButNotDue = !isCardDue && wordData?.reviewData?.due;
        const freshCard = !cardReviewButNotDue && !isCardDue;

        const moreToLoad = sliceArrState === index + 1 && !isLastInTotalOrder;

        return (
          <View
            key={wordId}
            style={{
              paddingBottom: isLastEl ? 20 : 0,
            }}>
            <View
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
                  {baseForm} {freshCard ? '🆕' : ''}
                </Text>
              </TouchableOpacity>
              {!isSelectedWord && (
                <SRSTogglesQuickComprehensive
                  reviewData={wordData.reviewData}
                  id={wordId}
                  baseForm={baseForm}
                  deleteWord={() => handleDeleteWord(wordData)}
                />
              )}
              {isSelectedWord && (
                <AnimatedWordModal
                  visible={wordData}
                  onClose={handleCloseModal}
                  deleteWord={() => handleDeleteWord(wordData)}
                />
              )}
            </View>
            {moreToLoad && (
              <Button onPress={handleExpandWordArray} title="See More" />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default FlashcardsWordsSection;
