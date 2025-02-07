import React, {View} from 'react-native';
import {srsRetentionKeyTypes} from '../srs-algo';
import SRSTogglesScaled from './SRSTogglesScaled';
import {srsCalculationAndText} from '../utils/srs/srs-calculation-and-text';
import {DeleteButton} from './Button';

const SRSTogglesMini = ({
  sentence,
  updateSentenceData,
  setShowReviewSettings,
  contentIndex,
  deleteFix,
}) => {
  const timeNow = new Date();

  const reviewData = sentence?.reviewData;
  const isAdhoc = sentence?.isAdhoc;

  const nextReview = sentence?.nextReview;

  const hasLegacyReviewSystem = !reviewData?.due && nextReview;

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
    if (deleteFix) {
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
        gap: 5,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
      }}>
      <SRSTogglesScaled
        handleNextReview={handleNextReview}
        againText={againText}
        hardText={hardText}
        goodText={goodText}
        easyText={easyText}
      />
      <DeleteButton onPress={handleClose} />
    </View>
  );
};

export default SRSTogglesMini;
