import React, {View} from 'react-native';
import {
  isMoreThanADayAhead,
  setToFiveAM,
  srsRetentionKeyTypes,
} from '../../srs-algo';
import {useState} from 'react';
import {getTimeDiffSRS} from '../../utils/getTimeDiffSRS';
import useWordData from '../../context/WordData/useWordData';
import {IconButton, MD2Colors, MD3Colors, Text} from 'react-native-paper';
import SRSTogglesScaled from '../SRSTogglesScaled';
import AreYouSurePrompt from '../AreYouSurePrompt';
import {srsCalculationAndText} from '../../utils/srs/srs-calculation-and-text';

const FlashCardSRSToggles = ({
  id,
  reviewData,
  baseForm,
  deleteWord,
  collapseAnimation,
  definition,
  updateWordDataAdditionalFunc,
}) => {
  const [showAreYouSureSectionState, setShowAreYouSureSectionState] =
    useState(false);
  const timeNow = new Date();
  const hasDueDate = reviewData?.due ? new Date(reviewData?.due) : null; // check if due yet

  const {updateWordData, combineWordsListState, setCombineWordsListState} =
    useWordData();

  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;

  const isInCombineWordList = combineWordsListState?.some(i => i.id === id);

  const {nextScheduledOptions, againText, hardText, goodText, easyText} =
    srsCalculationAndText({
      reviewData,
      contentType: srsRetentionKeyTypes.vocab,
      timeNow,
    });

  const handleYesSure = () => {
    deleteWord();
    setShowAreYouSureSectionState(false);
  };

  const handleNextReview = async difficulty => {
    collapseAnimation?.();
    await new Promise(resolve => setTimeout(resolve, 0));
    const nextReviewData = nextScheduledOptions[difficulty].card;
    const isMoreThanADayAheadBool = isMoreThanADayAhead(
      nextReviewData.due,
      new Date(),
    );

    const formattedToBe5am = isMoreThanADayAheadBool
      ? {...nextReviewData, due: setToFiveAM(nextReviewData.due)}
      : nextReviewData;

    formattedToBe5am.due.toISOString();
    formattedToBe5am.last_review.toISOString();

    const res = await updateWordData({
      wordId: id,
      wordBaseForm: baseForm,
      fieldToUpdate: {reviewData: formattedToBe5am},
    });

    if (res) {
      updateWordDataAdditionalFunc?.({
        wordId: id,
        wordBaseForm: baseForm,
        fieldToUpdate: {
          reviewData: {
            ...nextReviewData,
            due: nextReviewData.due.toISOString(),
            last_review: nextReviewData.last_review.toISOString(),
          },
        },
      });
    }
  };

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
          marginVertical: 5,
          alignItems: 'center',
          alignSelf: 'center',
          flexWrap: 'wrap',
        }}>
        {hasDueDateInFuture ? (
          <View
            style={{
              alignSelf: 'center',
            }}>
            <Text>
              Due in {getTimeDiffSRS({dueTimeStamp: hasDueDate, timeNow})}
            </Text>
          </View>
        ) : (
          <SRSTogglesScaled
            handleNextReview={handleNextReview}
            againText={againText}
            hardText={hardText}
            goodText={goodText}
            easyText={easyText}
            fontSize={10}
          />
        )}
        {isInCombineWordList ? (
          <IconButton
            icon="minus"
            containerColor={MD3Colors.error30}
            iconColor={MD2Colors.white}
            size={20}
            onPress={() => {
              setCombineWordsListState(prev => prev.filter(i => i.id !== id));
            }}
          />
        ) : (
          <IconButton
            icon="plus"
            containerColor={MD3Colors.tertiary60}
            iconColor={MD2Colors.white}
            size={20}
            onPress={() =>
              setCombineWordsListState(prev => [
                ...prev,
                {id, word: baseForm, definition},
              ])
            }
          />
        )}
        <IconButton
          icon="delete"
          containerColor={MD3Colors.error50}
          iconColor={MD2Colors.white}
          size={20}
          onPress={() =>
            setShowAreYouSureSectionState(!showAreYouSureSectionState)
          }
        />
      </View>
      {showAreYouSureSectionState && (
        <AreYouSurePrompt
          yesText="Delete!"
          yesOnPress={handleYesSure}
          noText="No"
          noOnPress={() => setShowAreYouSureSectionState(false)}
        />
      )}
    </View>
  );
};

export default FlashCardSRSToggles;
