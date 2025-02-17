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
  handleSelectWord,
  handleWordUpdate,
  openGoogleTranslateApp,
  underlineWordsInSentence,
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
        handleSelectWord={handleSelectWord}
        handleWordUpdate={handleWordUpdate}
        underlineWordsInSentence={underlineWordsInSentence}
      />
    </DifficultSentenceProvider>
  );
};

export default DifficultSentenceComponent;
