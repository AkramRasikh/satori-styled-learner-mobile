import React, {useRef, useState} from 'react';
import {Animated, Dimensions, Text, TouchableOpacity, View} from 'react-native';
import AnimatedWordModal from './WordModal';
import {SRSTogglesQuickComprehensive} from './SRSToggles';
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Icon,
  IconButton,
  MD2Colors,
  MD3Colors,
} from 'react-native-paper';
import useAnimation from '../hooks/useAnimation';
import AnimationContainer from './AnimationContainer';

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

const Container = ({
  wordData,
  index,
  selectedDueCardState,
  realCapacity,
  sliceArrState,
  setSelectedDueCardState,
  width,
  handleDeleteWord,
  handleCloseModal,
  handleExpandWordArray,
}) => {
  const [isCollapsingState, setIsCollapsingState] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const {collapseAnimation} = useAnimation({
    fadeAnim,
    scaleAnim,
  });

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

  const collapseAnimationWithState = async () => {
    setIsCollapsingState(true);
    await collapseAnimation();
  };

  const handleDeleteWordWithAnimation = async () => {
    setIsCollapsingState(true);
    await collapseAnimation();
    handleDeleteWord(wordData);
  };
  return (
    <>
      {isCollapsingState && (
        <View
          style={{
            margin: 10,
            alignItems: 'center',
            width: '100%',
          }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <AnimationContainer fadeAnim={fadeAnim} scaleAnim={scaleAnim}>
        <View>
          <Card
            style={{
              padding: 5,
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
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
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
              {isSelectedWord && (
                <IconButton
                  icon="close"
                  onPress={handleCloseModal}
                  mode="outlined"
                  iconColor={'white'}
                  containerColor={MD3Colors.error50}
                />
              )}
            </TouchableOpacity>
            <Divider bold />
            {!isSelectedWord && (
              <SRSTogglesQuickComprehensive
                reviewData={wordData.reviewData}
                id={wordId}
                baseForm={baseForm}
                deleteWord={handleDeleteWordWithAnimation}
                collapseAnimation={collapseAnimationWithState}
              />
            )}
            {isSelectedWord && (
              <AnimatedWordModal
                visible={wordData}
                onClose={handleCloseModal}
                deleteWord={handleDeleteWordWithAnimation}
                collapseAnimation={collapseAnimationWithState}
              />
            )}
          </Card>
        </View>
      </AnimationContainer>
      {moreToLoad && (
        <View
          style={{
            width: '100%',
            paddingBottom: 30,
            marginTop: 10,
          }}>
          <Button
            onPress={handleExpandWordArray}
            icon="refresh"
            mode="outlined">
            See More
          </Button>
        </View>
      )}
    </>
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
      {dueCardsState?.map((wordData, index) => (
        <Container
          key={wordData.id}
          wordData={wordData}
          index={index}
          selectedDueCardState={selectedDueCardState}
          realCapacity={realCapacity}
          sliceArrState={sliceArrState}
          setSelectedDueCardState={setSelectedDueCardState}
          width={width}
          handleDeleteWord={handleDeleteWord}
          handleCloseModal={handleCloseModal}
          handleExpandWordArray={handleExpandWordArray}
        />
      ))}
    </View>
  );
};

export default FlashcardsWordsSection;
