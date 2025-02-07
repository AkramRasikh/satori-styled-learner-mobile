import React, {useRef, useState} from 'react';
import {Animated} from 'react-native';
import {Divider} from 'react-native-paper';
import useAnimation from '../../hooks/useAnimation';
import FlashCardLoadingSpinner from './FlashCardLoadingSpinner';
import FlashCardTopSection from './FlashCardTopSection';
import FlashCardSRSToggles from './FlashCardSRSToggles';
import FlashCardModal from './FlashCardModal';
import FlashCardLoadMoreBtn from './FlashCardLoadMoreBtn';
import FlashCardBodyContainer from './FlashCardBodyContainer';

const FlashCard = ({
  wordData,
  index,
  realCapacity,
  sliceArrState,
  handleDeleteWord,
  handleExpandWordArray,
  selectedDueCardState,
  setSelectedDueCardState,
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
            cardReviewButNotDue={cardReviewButNotDue}>
            <FlashCardTopSection
              setSelectedDueCardState={setSelectedDueCardState}
              wordData={wordData}
              wordListText={wordListText}
              freshCard={freshCard}
              isSelectedWord={isSelectedWord}
              handleCloseModal={handleCloseModal}
            />
            <Divider bold />
            {isSelectedWord ? (
              <FlashCardModal
                wordData={wordData}
                onClose={handleCloseModal}
                deleteWord={handleDeleteWordWithAnimation}
                collapseAnimation={collapseAnimationWithState}
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
