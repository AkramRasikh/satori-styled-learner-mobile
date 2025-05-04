import React, {useState} from 'react';
import FlashCard from './FlashCard';
import {FlashCardProvider} from './FlashCard/context/FlashCardProvider';

const FlashcardsWordsSection = ({
  dueCardsState,
  handleDeleteWord,
  handleExpandWordArray,
  sliceArrState,
  realCapacity,
  scrollViewRef,
  handleAdhocMinimalPairFunc,
  handleAddCustomWordPromptFunc,
}) => {
  const [selectedDueCardState, setSelectedDueCardState] = useState();

  return dueCardsState.map((wordData, index) => (
    <FlashCardProvider key={wordData.id}>
      <FlashCard
        wordData={wordData}
        index={index}
        realCapacity={realCapacity}
        sliceArrState={sliceArrState}
        handleDeleteWord={handleDeleteWord}
        handleExpandWordArray={handleExpandWordArray}
        selectedDueCardState={selectedDueCardState}
        setSelectedDueCardState={setSelectedDueCardState}
        scrollViewRef={scrollViewRef}
        handleAdhocMinimalPairFunc={handleAdhocMinimalPairFunc}
        handleAddCustomWordPromptFunc={handleAddCustomWordPromptFunc}
      />
    </FlashCardProvider>
  ));
};

export default FlashcardsWordsSection;
