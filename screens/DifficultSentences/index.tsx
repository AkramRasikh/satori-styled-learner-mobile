import React from 'react';
import DifficultSentencesContainer from './DifficultSentencesContainer';
import LoadingScreen from '../../components/LoadingScreen';
import useData from '../../context/Data/useData';

const DifficultSentences = (): React.JSX.Element => {
  const data = useData();

  const dataProviderIsLoading = data.dataProviderIsLoading;
  const difficultSentencesState = data.difficultSentencesState;
  const updateSentenceData = data.updateSentenceData;
  const updatePromptState = data.updatePromptState;
  const addSnippet = data.addSnippet;
  const removeSnippet = data.removeSnippet;
  const pureWords = data.pureWords;

  if (dataProviderIsLoading || !difficultSentencesState.length) {
    return <LoadingScreen>Loading difficult sentences...</LoadingScreen>;
  }

  return (
    <DifficultSentencesContainer
      difficultSentencesState={difficultSentencesState}
      updateSentenceData={updateSentenceData}
      updatePromptState={updatePromptState}
      addSnippet={addSnippet}
      removeSnippet={removeSnippet}
      pureWords={pureWords}
    />
  );
};

export default DifficultSentences;
