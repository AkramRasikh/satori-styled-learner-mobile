import React, {View} from 'react-native';
import {getDueDate, srsRetentionKeyTypes} from '../srs-algo';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';
import {DeleteButton} from './Button';
import {DefaultTheme, Text} from 'react-native-paper';
import SRSTogglesScaled from './SRSTogglesScaled';
import {srsCalculationAndText} from '../utils/srs/srs-calculation-and-text';

const SatoriLineSRS = ({
  sentence,
  updateSentenceData,
  setShowReviewSettings,
  contentIndex,
}) => {
  const timeNow = new Date();

  const reviewData = sentence?.reviewData;
  const isAdhoc = sentence?.isAdhoc;

  const nextReview = sentence?.nextReview;

  const hasLegacyReviewSystem = !reviewData?.due && nextReview;

  const hasDueDate = getDueDate(reviewData);

  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;

  const {againText, hardText, goodText, easyText, nextScheduledOptions} =
    srsCalculationAndText({
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

  const handleClose = async () => {
    setShowReviewSettings(true);

    const hasBeenUpdated = await updateSentenceData({
      isAdhoc,
      topicName: sentence.topic,
      sentenceId: sentence.id,
      fieldToUpdate: {
        reviewData: null,
        ...getShouldRemoveLegacyFields(),
      },
      contentIndex: contentIndex ?? sentence.contentIndex,
    });

    if (hasBeenUpdated) {
      setShowReviewSettings(false);
    }
  };

  const handleNextReview = async difficulty => {
    const nextReviewData = nextScheduledOptions[difficulty].card;

    const hasBeenUpdated = await updateSentenceData({
      isAdhoc,
      topicName: sentence.topic,
      sentenceId: sentence.id,
      fieldToUpdate: {
        reviewData: nextReviewData,
        ...getShouldRemoveLegacyFields(),
      },
      contentIndex: contentIndex ?? sentence.contentIndex,
    });

    if (hasBeenUpdated) {
      setShowReviewSettings(false);
    }
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5,
        width: '100%',
      }}>
      {hasDueDateInFuture ? (
        <Text
          style={{
            ...DefaultTheme.fonts.bodySmall,
            alignSelf: 'center',
            fontStyle: 'italic',
          }}>
          Due in {getTimeDiffSRS({dueTimeStamp: hasDueDate, timeNow})}
        </Text>
      ) : (
        <SRSTogglesScaled
          handleNextReview={handleNextReview}
          againText={againText}
          hardText={hardText}
          goodText={goodText}
          easyText={easyText}
        />
      )}
      {hasDueDate && <DeleteButton onPress={handleClose} size={15} />}
    </View>
  );
};

export default SatoriLineSRS;
