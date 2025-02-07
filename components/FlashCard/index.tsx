import React, {MutableRefObject, useRef, useState} from 'react';
import {Animated} from 'react-native';
import {Divider} from 'react-native-paper';
import useAnimation from '../../hooks/useAnimation';
import FlashCardLoadingSpinner from './FlashCardLoadingSpinner';
import FlashCardTopSection from './FlashCardTopSection';
import FlashCardSRSToggles from './FlashCardSRSToggles';
import FlashCardModal from './FlashCardModal';
import FlashCardLoadMoreBtn from './FlashCardLoadMoreBtn';
import FlashCardBodyContainer from './FlashCardBodyContainer';
import AnimationContainer from '../AnimationContainer';

const NestedFlashCard = ({
  fadeAnimNestedModal,
  scaleAnimNestedModal,
  wordData,
  handleCloseModal,
  handleDeleteWordWithAnimation,
  collapseAnimationWithState,
}) => {
  const fadeAnim = fadeAnimNestedModal || useRef(new Animated.Value(0)).current;
  const scaleAnim =
    scaleAnimNestedModal || useRef(new Animated.Value(0.8)).current;
  useAnimation({
    fadeAnim,
    scaleAnim,
  });

  return (
    <AnimationContainer fadeAnim={fadeAnim} scaleAnim={scaleAnim}>
      <FlashCardModal
        wordData={wordData}
        onClose={handleCloseModal}
        deleteWord={handleDeleteWordWithAnimation}
        collapseAnimation={collapseAnimationWithState}
      />
    </AnimationContainer>
  );
};

const FlashCard = ({
  wordData,
  index,
  realCapacity,
  sliceArrState,
  handleDeleteWord,
  handleExpandWordArray,
  selectedDueCardState,
  setSelectedDueCardState,
  scrollViewRef,
}) => {
  const [isCollapsingState, setIsCollapsingState] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnimNestedModal = useRef(new Animated.Value(0)).current;
  const scaleAnimNestedModal = useRef(new Animated.Value(0.8)).current;
  const targetRef = useRef(null);

  const {collapseAnimation} = useAnimation({
    fadeAnim,
    scaleAnim,
  });
  const {collapseAnimation: collapseAnimationNestedFlashCard} = useAnimation({
    fadeAnim: fadeAnimNestedModal,
    scaleAnim: scaleAnimNestedModal,
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

  const handleCloseModal = async () => {
    await new Promise(resolve => {
      collapseAnimationNestedFlashCard();
      setTimeout(resolve, 100);
    });
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

  const scrollToTarget = () => {
    targetRef.current?.measureLayout(scrollViewRef.current, (_, y) => {
      scrollViewRef.current?.scrollTo({y: y - 100, animated: true});
    });
  };
  const selectWordWithScroll = () => {
    setSelectedDueCardState(wordData);
    scrollToTarget();
  };

  return (
    <>
      {isCollapsingState ? (
        <FlashCardLoadingSpinner />
      ) : (
        <>
          <FlashCardBodyContainer
            fadeAnim={fadeAnim}
            scaleAnim={scaleAnim}
            isCardDue={isCardDue}
            isSelectedWord={isSelectedWord}
            cardReviewButNotDue={cardReviewButNotDue}
            targetRef={targetRef}>
            <FlashCardTopSection
              selectWordWithScroll={selectWordWithScroll}
              wordListText={wordListText}
              freshCard={freshCard}
              isSelectedWord={isSelectedWord}
              handleCloseModal={handleCloseModal}
            />
            <Divider bold />
            {isSelectedWord ? (
              <NestedFlashCard
                fadeAnimNestedModal={fadeAnimNestedModal}
                scaleAnimNestedModal={scaleAnimNestedModal}
                wordData={wordData}
                handleCloseModal={handleCloseModal}
                handleDeleteWordWithAnimation={handleDeleteWordWithAnimation}
                collapseAnimationWithState={collapseAnimationWithState}
              />
            ) : (
              <FlashCardSRSToggles
                reviewData={wordData.reviewData}
                id={wordId}
                baseForm={baseForm}
                deleteWord={handleDeleteWordWithAnimation}
                collapseAnimation={collapseAnimationWithState}
              />
            )}
          </FlashCardBodyContainer>
          {moreToLoad && (
            <FlashCardLoadMoreBtn
              handleExpandWordArray={handleExpandWordArray}
            />
          )}
        </>
      )}
    </>
  );
};

export default FlashCard;
