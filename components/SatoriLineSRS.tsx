import React, {Text, TouchableOpacity, View} from 'react-native';
import {getDueDate, srsRetentionKeyTypes} from '../srs-algo';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';
import SRSTogglesMini from './SRSTogglesMini';

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
        <View style={{padding: 10, alignSelf: 'center'}}>
          <Text>
            Due in {getTimeDiffSRS({dueTimeStamp: hasDueDate, timeNow})}
          </Text>
        </View>
      ) : (
        <SRSTogglesMini
          sentence={sentence}
          updateSentenceData={updateSentenceData}
          setShowReviewSettings={setShowReviewSettings}
          contentType={srsRetentionKeyTypes.sentences}
          contentIndex={contentIndex}
          deleteFix
        />
      )}
      {showDeleteBtn && (
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            backgroundColor: '#6082B6',
            padding: 5,
            borderRadius: 10,
          }}
          onPress={handleRemoveSentenceReview}>
          <Text>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SatoriLineSRS;
