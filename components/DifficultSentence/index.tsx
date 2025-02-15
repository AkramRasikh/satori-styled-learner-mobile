import React from 'react';

import {DifficultSentenceProvider} from './context/DifficultSentenceProvider';
import DifficultSentenceContainer from './DifficultSentenceContainer';

const DifficultSentenceComponent = ({
  toggleableSentencesStateLength,
  sliceArrState,
  setSliceArrState,
  sentence,
  indexNum,
  realCapacity,
  navigation,
  updateSentenceData,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  handleSelectWord,
  handleWordUpdate,
  openGoogleTranslateApp,
}) => {
  return (
    <DifficultSentenceProvider
      updateSentenceData={updateSentenceData}
      openGoogleTranslateApp={openGoogleTranslateApp}
      sentence={sentence}>
      <DifficultSentenceContainer
        setSliceArrState={setSliceArrState}
        toggleableSentencesStateLength={toggleableSentencesStateLength}
        indexNum={indexNum}
        sliceArrState={sliceArrState}
        sentence={sentence}
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
