import React, {View, TouchableOpacity} from 'react-native';
import {Button, DefaultTheme, IconButton, Text} from 'react-native-paper';
import {getDueDate, srsRetentionKeyTypes} from '../srs-algo';
import {srsCalculationAndText} from '../utils/srs/srs-calculation-and-text';

const BilingualTextSwipeSRS = ({
  setShowQuickReviewState,
  sentence,
  updateSentenceData,
  contentIndex,
}) => {
  const timeNow = new Date();

  const reviewData = sentence?.reviewData;
  const isAdhoc = sentence?.isAdhoc;

  const nextReview = sentence?.nextReview;

  const hasLegacyReviewSystem = !reviewData?.due && nextReview;

  const hasDueDate = getDueDate(reviewData);

  const {hardText, nextScheduledOptions} = srsCalculationAndText({
    reviewData,
    contentType: srsRetentionKeyTypes.sentences,
    timeNow,
  });

  const getShouldRemoveLegacyFields = () => {
    if (hasLegacyReviewSystem) {
      return {
        nextReview: null,
        reviewHistory: null,
      };
    }
    return {};
  };

  const handleDeleteReview = async () => {
    setShowQuickReviewState(false);
    await updateSentenceData({
      isAdhoc,
      topicName: sentence.topic,
      sentenceId: sentence.id,
      fieldToUpdate: {
        reviewData: null,
        ...getShouldRemoveLegacyFields(),
      },
      contentIndex: contentIndex ?? sentence.contentIndex,
    });
  };

  const handleNextReview = async () => {
    const nextReviewData = nextScheduledOptions['3'].card;
    setShowQuickReviewState(false);
    await updateSentenceData({
      isAdhoc,
      topicName: sentence.topic,
      sentenceId: sentence.id,
      fieldToUpdate: {
        reviewData: nextReviewData,
        ...getShouldRemoveLegacyFields(),
      },
      contentIndex: contentIndex ?? sentence.contentIndex,
    });
  };

  return (
    <View
      style={{
        width: '20%',
        alignItems: 'center',
        display: 'flex',
        gap: 10,
        borderLeftWidth: 1,
        borderColor: 'black',
      }}>
      {!hasDueDate && (
        <Button
          onPress={handleNextReview}
          compact
          mode="outlined"
          textColor={DefaultTheme.colors.onSurface}
          labelStyle={{
            fontSize: 12,
          }}>
          {hardText}
        </Button>
      )}
      {hasDueDate && (
        <TouchableOpacity onPress={handleDeleteReview}>
          <Text>🗑️</Text>
        </TouchableOpacity>
      )}
      <IconButton
        onPress={() => setShowQuickReviewState(false)}
        icon="close"
        iconColor="red"
      />
    </View>
  );
};

export default BilingualTextSwipeSRS;
