import React, {TouchableOpacity, View} from 'react-native';
import {
  getEmptyCard,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../srs-algo';
import {useState} from 'react';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';
import useWordData from '../context/WordData/useWordData';
import {Button, Text} from 'react-native-paper';
import AreYouSurePrompt from './AreYouSurePrompt';
import {srsCalculationAndText} from '../utils/srs/srs-calculation-and-text';

const SRSToggles = ({
  id,
  reviewData,
  baseForm,
  onCloseModal,
  collapseAnimation,
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

  const {updateWordData} = useWordData();

  const handleNextReview = async difficulty => {
    const nextReviewData = nextScheduledOptions[difficulty].card;
    await collapseAnimation?.();
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
    setNextReviewDateState(nextReviewData.due);
    onCloseModal?.();
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
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
          <Button onPress={() => handleNextReview('1')} mode="outlined" compact>
            {againText}
          </Button>
          <Button onPress={() => handleNextReview('2')} mode="outlined" compact>
            {hardText}
          </Button>
          <Button onPress={() => handleNextReview('3')} mode="outlined" compact>
            {goodText}
          </Button>
          <Button onPress={() => handleNextReview('4')} mode="outlined" compact>
            {easyText}
          </Button>
        </>
      )}
    </View>
  );
};

const GenericButton = ({clearBtns, children, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        alignSelf: 'center',
        backgroundColor: clearBtns ? 'transparent' : '#6082B6',
        borderColor: clearBtns ? clearBtns : '#6082B6',
        borderWidth: clearBtns ? 2 : 0,
        padding: 5,
        borderRadius: 10,
      }}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export const SRSTogglesQuickComprehensiveDiffSentencesWords = ({
  id,
  reviewData,
  baseForm,
  deleteWord,
  updateWordData,
  clearBtns,
}) => {
  const [showAreYouSureSectionState, setShowAreYouSureSectionState] =
    useState(false);
  const timeNow = new Date();
  const hasDueDate = reviewData?.due ? new Date(reviewData?.due) : null; // check if due yet

  const cardDataRelativeToNow = hasDueDate ? reviewData : getEmptyCard();

  const nextScheduledOptions = getNextScheduledOptions({
    card: cardDataRelativeToNow,
    contentType: srsRetentionKeyTypes.vocab,
  });

  const goodDue = nextScheduledOptions['3'].card.due;
  const easyDue = nextScheduledOptions['4'].card.due;

  const handleYesSure = () => {
    deleteWord();
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
  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;

  const goodText = getTimeDiffSRS({dueTimeStamp: goodDue, timeNow}) as string;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;

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
        {!hasDueDateInFuture && (
          <>
            <GenericButton
              clearBtns={clearBtns}
              onPress={() => handleNextReview('3')}>
              <Text>{goodText}</Text>
            </GenericButton>
            <GenericButton
              clearBtns={clearBtns}
              onPress={() => handleNextReview('4')}>
              <Text>{easyText}</Text>
            </GenericButton>
          </>
        )}
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            borderWidth: 2,
            padding: 5,
            borderRadius: 10,
          }}
          onPress={() =>
            setShowAreYouSureSectionState(!showAreYouSureSectionState)
          }>
          <Text>🗑️</Text>
        </TouchableOpacity>
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

export default SRSToggles;
