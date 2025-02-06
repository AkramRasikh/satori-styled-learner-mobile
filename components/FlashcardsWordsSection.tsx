import React, {useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import AnimatedWordModal from './WordModal';
import {SRSTogglesQuickComprehensive} from './SRSToggles';
import {Button, Divider, Icon, MD2Colors} from 'react-native-paper';

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
        const listTextNumber = index + 1 + ') ';
        const wordId = wordData.id;
        const isSelectedWord = selectedDueCardState?.id === wordId;
        const baseForm = wordData.baseForm;
        const isLastInTotalOrder = realCapacity === index + 1;
        const isCardDue = wordData?.isCardDue;
        const cardReviewButNotDue = !isCardDue && wordData?.reviewData?.due;
        const freshCard = !cardReviewButNotDue && !isCardDue;

        const moreToLoad = sliceArrState === index + 1 && !isLastInTotalOrder;

        const wordListText = listTextNumber + baseForm;
        return (
          <React.Fragment key={wordId}>
            <View>
              <View
                style={{
                  borderBlockColor: 'black',
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 5,
                  width: isSelectedWord ? width * 0.9 : 'auto',
                  backgroundColor: cardReviewButNotDue
                    ? MD2Colors.blue100
                    : isCardDue && MD2Colors.red100,
                }}>
                <TouchableOpacity
                  onPress={() => setSelectedDueCardState(wordData)}
                  style={{
                    alignSelf: 'flex-start',
                    marginVertical: 5,
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      fontSize: 24,
                      flexWrap: 'wrap',
                    }}>
                    {wordListText}
                    {
                      <Icon
                        source={freshCard ? 'new-box' : ''}
                        size={24}
                        color={MD2Colors.green500}
                      />
                    }
                  </Text>
                </TouchableOpacity>
                <Divider bold />
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
            </View>
            {moreToLoad && (
              <View
                style={{
                  width: '100%',
                  paddingBottom: 30,
                }}>
                <Button
                  onPress={handleExpandWordArray}
                  icon="refresh"
                  mode="outlined">
                  See More
                </Button>
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default FlashcardsWordsSection;
