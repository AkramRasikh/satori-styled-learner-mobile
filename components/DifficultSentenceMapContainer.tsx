import React from 'react';
import {Button, View} from 'react-native';
import DifficultSentenceWidget from './DifficultSentenceWidget';
import {calculateDueDate} from '../utils/get-date-due-status';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';

const DifficultSentenceMapContainer = ({
  toggleableSentencesState,
  addSnippet,
  updateSentenceData,
  removeSnippet,
  pureWords,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  navigation,
  sliceArrState,
  setSliceArrState,
  realCapacity,
}) => {
  const todayDateObj = new Date();
  return (
    <View style={{marginTop: 10}}>
      {toggleableSentencesState.map((sentence, index) => {
        const isLastEl = toggleableSentencesState.length === index + 1;
        const isFirst = 0 === index;
        const isLastInTotalOrder = realCapacity === index + 1;
        const moreToLoad = sliceArrState === index + 1 && !isLastInTotalOrder;
        const nextDueTime = sentence?.reviewData?.due || sentence.nextReview;
        const dueStatus = calculateDueDate({
          todayDateObj,
          nextReview: nextDueTime,
        });
        const dueDate = getTimeDiffSRS({
          dueTimeStamp: new Date(nextDueTime),
          timeNow: todayDateObj,
        });

        return (
          <View
            key={sentence.id}
            style={{
              paddingBottom: isLastEl ? 100 : 0,
              paddingTop: !isFirst ? 70 : 0,
            }}>
            <DifficultSentenceWidget
              sentence={sentence}
              updateSentenceData={updateSentenceData}
              dueStatus={dueStatus}
              dueDate={dueDate}
              addSnippet={addSnippet}
              removeSnippet={removeSnippet}
              pureWords={pureWords}
              sentenceBeingHighlightedState={sentenceBeingHighlightedState}
              setSentenceBeingHighlightedState={
                setSentenceBeingHighlightedState
              }
              navigation={navigation}
              indexNum={index}
            />
            {moreToLoad && (
              <Button
                onPress={() => setSliceArrState(prev => prev + 5)}
                title="See More"
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default DifficultSentenceMapContainer;
