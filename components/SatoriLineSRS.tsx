import React, {View} from 'react-native';
import {getDueDate} from '../srs-algo';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';
import SRSTogglesMini from './SRSTogglesMini';
import {DeleteButton} from './Button';
import {DefaultTheme, Text} from 'react-native-paper';

const SatoriLineSRS = ({
  topicName,
  sentence,
  updateSentenceData,
  setShowReviewSettings,
  contentIndex,
}) => {
  const timeNow = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reviewData = sentence?.reviewData;

  const hasDueDate = getDueDate(reviewData);

  const nextReview = sentence?.nextReview;

  const hasLegacyReviewSystem = !reviewData?.due && nextReview;

  const getShouldRemoveLegacyFields = () => {
    if (hasLegacyReviewSystem) {
      return {
        nextReview: null,
        reviewHistory: null,
      };
    }
    return {};
  };

  const handleRemoveSentenceReview = async () => {
    try {
      await updateSentenceData({
        topicName,
        sentenceId: sentence.id,
        fieldToUpdate: {
          reviewData: null,
          ...getShouldRemoveLegacyFields(),
        },
        contentIndex,
      });
      setShowReviewSettings(false);
    } catch (error) {
      console.log('## handleRemoveSentenceReview', {error});
    }
  };

  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;

  const showDeleteBtn = hasDueDateInFuture || nextReview;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        <SRSTogglesMini
          sentence={sentence}
          updateSentenceData={updateSentenceData}
          setShowReviewSettings={setShowReviewSettings}
          contentIndex={contentIndex}
          deleteFix
        />
      )}
      {showDeleteBtn && (
        <DeleteButton onPress={handleRemoveSentenceReview} size={15} />
      )}
    </View>
  );
};

export default SatoriLineSRS;
