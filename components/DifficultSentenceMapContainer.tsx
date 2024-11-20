import React from 'react';
import {View} from 'react-native';
import DifficultSentenceWidget from './DifficultSentenceWidget';
import {calculateDueDate} from '../utils/get-date-due-status';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';

const todayDateObj = new Date();

const DifficultSentenceMapContainer = React.memo(
  ({
    toggleableSentencesState,
    addSnippet,
    updateSentenceData,
    removeSnippet,
    pureWords,
    sentenceBeingHighlightedState,
    setSentenceBeingHighlightedState,
    navigation,
  }) => {
    return (
      <View style={{marginTop: 10}}>
        {toggleableSentencesState.map((sentence, index) => {
          const isLastEl = toggleableSentencesState.length === index + 1;
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
            <DifficultSentenceWidget
              key={sentence.id}
              sentence={sentence}
              updateSentenceData={updateSentenceData}
              dueStatus={dueStatus}
              dueDate={dueDate}
              isLastEl={isLastEl}
              addSnippet={addSnippet}
              removeSnippet={removeSnippet}
              pureWords={pureWords}
              sentenceBeingHighlightedState={sentenceBeingHighlightedState}
              setSentenceBeingHighlightedState={
                setSentenceBeingHighlightedState
              }
              navigation={navigation}
            />
          );
        })}
      </View>
    );
  },
);

export default DifficultSentenceMapContainer;
