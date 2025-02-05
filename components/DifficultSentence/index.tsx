import React from 'react';

import {DifficultSentenceProvider} from './context/DifficultSentenceProvider';
import DifficultSentenceContainer from './DifficultSentenceContainer';

const DifficultSentenceComponent = ({
  toggleableSentencesStateLength,
  sliceArrState,
  setSliceArrState,
  sentence,
  indexNum,
  updatingSentenceState,
  realCapacity,
  navigation,
  updateSentenceData,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  handleSelectWord,
  handleWordUpdate,
}) => {
  return (
    <DifficultSentenceProvider
      updateSentenceData={updateSentenceData}
      sentence={sentence}
      indexNum={indexNum}>
      <DifficultSentenceContainer
        setSliceArrState={setSliceArrState}
        toggleableSentencesStateLength={toggleableSentencesStateLength}
        indexNum={indexNum}
        sliceArrState={sliceArrState}
        sentence={sentence}
        updatingSentenceState={updatingSentenceState}
        realCapacity={realCapacity}
        navigation={navigation}
        sentenceBeingHighlightedState={sentenceBeingHighlightedState}
        setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
        handleSelectWord={handleSelectWord}
        handleWordUpdate={handleWordUpdate}
      />
    </DifficultSentenceProvider>
  );
};

export default DifficultSentenceComponent;
