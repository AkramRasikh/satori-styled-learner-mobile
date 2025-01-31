import React from 'react';
import {Button, View} from 'react-native';
import {calculateDueDate} from '../../utils/get-date-due-status';
import {getTimeDiffSRS} from '../../utils/getTimeDiffSRS';
import DifficultSentenceBody from './DifficultSentenceBody';
import LoadingWidget from '../LoadingWidget';

const DifficultSentenceComponent = ({
  toggleableSentencesStateLength,
  addSnippet,
  updateSentenceData,
  removeSnippet,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  navigation,
  sliceArrState,
  setSliceArrState,
  realCapacity,
  handleSelectWord,
  handleWordUpdate,
  deleteWord,
  sentence,
  indexNum,
  updatingSentenceState,
}) => {
  const todayDateObj = new Date();

  const isLastEl = toggleableSentencesStateLength === indexNum + 1;
  const isFirst = 0 === indexNum;
  const isLastInTotalOrder = realCapacity === indexNum + 1;
  const moreToLoad = sliceArrState === indexNum + 1 && !isLastInTotalOrder;
  const nextDueTime = sentence?.reviewData?.due || sentence.nextReview;
  const dueStatus = calculateDueDate({
    todayDateObj,
    nextReview: nextDueTime,
  });
  const dueDate = getTimeDiffSRS({
    dueTimeStamp: new Date(nextDueTime),
    timeNow: todayDateObj,
  });

  const thisSentenceIsLoading = updatingSentenceState === sentence.id;

  return (
    <View
      style={{
        paddingBottom: isLastEl ? 100 : 0,
        paddingTop: !isFirst ? 70 : 0,
        opacity: thisSentenceIsLoading ? 0.5 : 1,
      }}>
      {thisSentenceIsLoading && <LoadingWidget />}
      <DifficultSentenceBody
        sentence={sentence}
        updateSentenceData={updateSentenceData}
        dueStatus={dueStatus}
        dueDate={dueDate}
        addSnippet={addSnippet}
        removeSnippet={removeSnippet}
        sentenceBeingHighlightedState={sentenceBeingHighlightedState}
        setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
        navigation={navigation}
        handleSelectWord={handleSelectWord}
        handleWordUpdate={handleWordUpdate}
        deleteWord={deleteWord}
        indexNum={indexNum}
      />
      {moreToLoad && (
        <Button
          onPress={() => setSliceArrState(prev => prev + 5)}
          title="See More"
        />
      )}
    </View>
  );
};

export default DifficultSentenceComponent;
