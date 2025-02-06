import React, {View} from 'react-native';
import {srsRetentionKeyTypes} from '../../srs-algo';
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
}) => {
  const [showAreYouSureSectionState, setShowAreYouSureSectionState] =
    useState(false);
  const timeNow = new Date();
  const hasDueDate = reviewData?.due ? new Date(reviewData?.due) : null; // check if due yet

  const {updateWordData} = useWordData();

  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;

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
    await collapseAnimation?.();
    const nextReviewData = nextScheduledOptions[difficulty].card;
    updateWordData({
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
  };

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
            marginVertical: 5,
            alignItems: 'center',
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
