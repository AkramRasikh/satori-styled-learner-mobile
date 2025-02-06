import React, {useRef, useState} from 'react';
import {Animated, Dimensions, View} from 'react-native';
import {Button, Card, Divider, MD2Colors} from 'react-native-paper';
import {SRSTogglesQuickComprehensive} from '../SRSToggles';
import AnimatedWordModal from '../WordModal';
import AnimationContainer from '../AnimationContainer';
import useAnimation from '../../hooks/useAnimation';
import FlashCardLoadingSpinner from './FlashCardLoadingSpinner';
import FlashCardTopSection from './FlashCardTopSection';

const FlashCard = ({
  wordData,
  index,
  selectedDueCardState,
  realCapacity,
  sliceArrState,
  setSelectedDueCardState,
  handleDeleteWord,
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

  const handleCloseModal = () => {
    setSelectedDueCardState(null);
  };

  const collapseAnimationWithState = async () => {
    setIsCollapsingState(true);
    await collapseAnimation();
  };

  const handleDeleteWordWithAnimation = async () => {
    setIsCollapsingState(true);
    await collapseAnimation();
    handleDeleteWord(wordData);
  };

  const {width} = Dimensions.get('window');

  return (
    <>
      {isCollapsingState && <FlashCardLoadingSpinner />}
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
            <FlashCardTopSection
              setSelectedDueCardState={setSelectedDueCardState}
              wordData={wordData}
              wordListText={wordListText}
              freshCard={freshCard}
              isSelectedWord={isSelectedWord}
              handleCloseModal={handleCloseModal}
            />
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

export default FlashCard;
