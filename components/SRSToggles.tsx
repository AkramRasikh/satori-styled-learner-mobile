import React, {TouchableOpacity, View} from 'react-native';
import {srsRetentionKeyTypes} from '../srs-algo';
import {useState} from 'react';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';
import {
  Button,
  DefaultTheme,
  IconButton,
  MD2Colors,
  MD3Colors,
  Text,
} from 'react-native-paper';
import AreYouSurePrompt from './AreYouSurePrompt';
import {srsCalculationAndText} from '../utils/srs/srs-calculation-and-text';

export const SRSTogglesQuickComprehensiveDiffSentencesWords = ({
  wordData,
  deleteWord,
  updateWordData,
}) => {
  const id = wordData.id;
  const reviewData = wordData?.reviewData;
  const baseForm = wordData?.baseForm;

  const [showAreYouSureSectionState, setShowAreYouSureSectionState] =
    useState(false);
  const timeNow = new Date();

  const {nextScheduledOptions, goodText, easyText} = srsCalculationAndText({
    reviewData,
    contentType: srsRetentionKeyTypes.vocab,
    timeNow,
  });

  const handleYesSure = () => {
    deleteWord({
      wordId: id,
      wordBaseForm: baseForm,
    });
    setShowAreYouSureSectionState(false);
  };

  const handleNextReview = difficulty => {
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
    <>
      <View
        style={{
          gap: 10,
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginVertical: 5,
        }}>
        <Button
          onPress={() => handleNextReview('3')}
          compact
          mode="outlined"
          textColor={DefaultTheme.colors.onSurface}
          labelStyle={{
            fontSize: 12,
          }}>
          {goodText}
        </Button>

        <Button
          onPress={() => handleNextReview('4')}
          compact
          mode="outlined"
          textColor={DefaultTheme.colors.onSurface}
          labelStyle={{
            fontSize: 12,
          }}>
          {easyText}
        </Button>

        <IconButton
          icon="delete"
          containerColor={MD3Colors.error50}
          iconColor={MD2Colors.white}
          size={15}
          style={{
            alignSelf: 'center',
          }}
          onPress={() =>
            setShowAreYouSureSectionState(!showAreYouSureSectionState)
          }
        />
      </View>
      {showAreYouSureSectionState && (
        <AreYouSurePrompt
          yesText={'Delete!'}
          yesOnPress={handleYesSure}
          noText={'No'}
          noOnPress={() => setShowAreYouSureSectionState(false)}
        />
      )}
    </>
  );
};

export const DifficultSentencesSRSToggles = ({
  id,
  reviewData,
  baseForm,
  limitedOptionsMode,
  updateWordData,
}) => {
  const [nextReviewDateState, setNextReviewDateState] = useState('');
  const timeNow = new Date();
  const hasDueDate = reviewData?.due ? new Date(reviewData?.due) : null; // check if due yet
  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;

  const {nextScheduledOptions, againText, hardText, goodText, easyText} =
    srsCalculationAndText({
      reviewData,
      contentType: srsRetentionKeyTypes.vocab,
      timeNow,
    });

  const handleNextReview = async difficulty => {
    const nextReviewData = nextScheduledOptions[difficulty].card;
    try {
      await updateWordData({
        wordId: id,
        wordBaseForm: baseForm,
        fieldToUpdate: {reviewData: nextReviewData},
      });
      setNextReviewDateState(nextReviewData.due);
    } catch (error) {
      console.log('## handleNextReview', {error});
    }
  };

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {nextReviewDateState ? (
          <Text>
            {getTimeDiffSRS({dueTimeStamp: nextReviewDateState, timeNow})}
          </Text>
        ) : hasDueDateInFuture ? (
          <Text>
            Due in {getTimeDiffSRS({dueTimeStamp: hasDueDate, timeNow})}
          </Text>
        ) : (
          <>
            {!limitedOptionsMode && (
              <>
                <View>
                  <Button
                    title={againText}
                    onPress={() => handleNextReview('1')}
                  />
                </View>
                <View>
                  <Button
                    title={hardText}
                    onPress={() => handleNextReview('2')}
                  />
                </View>
              </>
            )}
            {limitedOptionsMode ? (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#6082B6',
                    padding: 5,
                    borderRadius: 10,
                  }}
                  onPress={() => handleNextReview('3')}>
                  <Text>{goodText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#6082B6',
                    padding: 5,
                    borderRadius: 10,
                  }}
                  onPress={() => handleNextReview('4')}>
                  <Text>{easyText}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View>
                  <Button
                    title={goodText}
                    onPress={() => handleNextReview('3')}
                  />
                </View>
                <View>
                  <Button
                    title={easyText}
                    onPress={() => handleNextReview('4')}
                  />
                </View>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};
