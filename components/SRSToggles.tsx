import React, {Text, TouchableOpacity, View} from 'react-native';
import {
  getEmptyCard,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../srs-algo';
import {useState} from 'react';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';
import useWordData from '../context/WordData/useWordData';
import {QuickAreYouSureSection} from './AreYouSureSection';
import {Button} from 'react-native-paper';
import SRSTogglesScaled from './SRSTogglesScaled';

const SRSToggles = ({
  reviewData,
  id,
  baseForm,
  limitedOptionsMode,
  onCloseModal,
}) => {
  const [nextReviewDateState, setNextReviewDateState] = useState('');
  const timeNow = new Date();
  const hasDueDate = reviewData?.due ? new Date(reviewData?.due) : null; // check if due yet

  const cardDataRelativeToNow = hasDueDate ? reviewData : getEmptyCard();
  const {updateWordData} = useWordData();

  const nextScheduledOptions = getNextScheduledOptions({
    card: cardDataRelativeToNow,
    contentType: srsRetentionKeyTypes.vocab,
  });
  const againDue = nextScheduledOptions['1'].card.due;
  const hardDue = nextScheduledOptions['2'].card.due;
  const goodDue = nextScheduledOptions['3'].card.due;
  const easyDue = nextScheduledOptions['4'].card.due;

  const handleNextReview = difficulty => {
    const nextReviewData = nextScheduledOptions[difficulty].card;
    try {
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
    } catch (error) {
      console.log('## handleNextReview', {error});
    }
  };

  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;
  const againText = getTimeDiffSRS({dueTimeStamp: againDue, timeNow}) as string;
  const hardText = getTimeDiffSRS({dueTimeStamp: hardDue, timeNow}) as string;
  const goodText = getTimeDiffSRS({dueTimeStamp: goodDue, timeNow}) as string;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;

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

export const SRSTogglesQuickComprehensive = ({
  id,
  reviewData,
  baseForm,
  deleteWord,
}) => {
  const [showAreYouSureSectionState, setShowAreYouSureSectionState] =
    useState(false);
  const timeNow = new Date();
  const hasDueDate = reviewData?.due ? new Date(reviewData?.due) : null; // check if due yet

  const cardDataRelativeToNow = hasDueDate ? reviewData : getEmptyCard();
  const {updateWordData} = useWordData();

  const nextScheduledOptions = getNextScheduledOptions({
    card: cardDataRelativeToNow,
    contentType: srsRetentionKeyTypes.vocab,
  });
  const againDue = nextScheduledOptions['1'].card.due;
  const hardDue = nextScheduledOptions['2'].card.due;
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

  const againText = getTimeDiffSRS({dueTimeStamp: againDue, timeNow}) as string;
  const hardText = getTimeDiffSRS({dueTimeStamp: hardDue, timeNow}) as string;
  const goodText = getTimeDiffSRS({dueTimeStamp: goodDue, timeNow}) as string;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;

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
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              backgroundColor: 'darkred',
              padding: 5,
              borderRadius: 10,
            }}
            onPress={() =>
              setShowAreYouSureSectionState(!showAreYouSureSectionState)
            }>
            <Text>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showAreYouSureSectionState && (
        <QuickAreYouSureSection
          handleClose={() => setShowAreYouSureSectionState(false)}
          handleYesSure={handleYesSure}
        />
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
    <View>
      <View
        style={{
          gap: 10,
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginVertical: 5,
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
        <QuickAreYouSureSection
          handleClose={() => setShowAreYouSureSectionState(false)}
          handleYesSure={handleYesSure}
        />
      )}
    </View>
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

  const cardDataRelativeToNow = hasDueDate ? reviewData : getEmptyCard();

  const nextScheduledOptions = getNextScheduledOptions({
    card: cardDataRelativeToNow,
    contentType: srsRetentionKeyTypes.vocab,
  });
  const againDue = nextScheduledOptions['1'].card.due;
  const hardDue = nextScheduledOptions['2'].card.due;
  const goodDue = nextScheduledOptions['3'].card.due;
  const easyDue = nextScheduledOptions['4'].card.due;

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

  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;
  const againText = getTimeDiffSRS({dueTimeStamp: againDue, timeNow}) as string;
  const hardText = getTimeDiffSRS({dueTimeStamp: hardDue, timeNow}) as string;
  const goodText = getTimeDiffSRS({dueTimeStamp: goodDue, timeNow}) as string;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;

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
