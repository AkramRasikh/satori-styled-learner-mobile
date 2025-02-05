import React from 'react';

import {DifficultSentenceProvider} from './context/DifficultSentenceProvider';
import CollapsibleCard from './DifficultSentenceAnimationContainer';
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
  deleteWord,
  addSnippet,
  updateSentenceData,
  removeSnippet,
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
      <CollapsibleCard>
        <DifficultSentenceContainer
          setSliceArrState={setSliceArrState}
          toggleableSentencesStateLength={toggleableSentencesStateLength}
          indexNum={indexNum}
          sliceArrState={sliceArrState}
          sentence={sentence}
          updatingSentenceState={updatingSentenceState}
          handleClickDelete={deleteWord}
          realCapacity={realCapacity}
          navigation={navigation}
          addSnippet={addSnippet}
          updateSentenceData={updateSentenceData}
          removeSnippet={removeSnippet}
          sentenceBeingHighlightedState={sentenceBeingHighlightedState}
          setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
          handleSelectWord={handleSelectWord}
          handleWordUpdate={handleWordUpdate}
        />
      </CollapsibleCard>
    </DifficultSentenceProvider>
  );
};

export default DifficultSentenceComponent;
