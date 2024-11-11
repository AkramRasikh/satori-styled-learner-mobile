import React from 'react';
import DifficultSentencesContainer from './DifficultSentencesContainer';
import LoadingScreen from '../../components/LoadingScreen';
import useData from '../../context/Data/useData';

const DifficultSentences = (): React.JSX.Element => {
  const data = useData();

  const dataProviderIsLoading = data.dataProviderIsLoading;
  const updateSentenceData = data.updateSentenceData;
  const updatePromptState = data.updatePromptState;
  const addSnippet = data.addSnippet;
  const removeSnippet = data.removeSnippet;
  const pureWords = data.pureWords;

  const adhocTargetLanguageSentencesState =
    data.adhocTargetLanguageSentencesState;
  const targetLanguageLoadedContentMaster =
    data.targetLanguageLoadedContentMaster;
  const targetLanguageSnippetsState = data.targetLanguageSnippetsState;
  if (dataProviderIsLoading) {
    return <LoadingScreen>Loading difficult sentences...</LoadingScreen>;
  }

  return (
    <DifficultSentencesContainer
      updateSentenceData={updateSentenceData}
      updatePromptState={updatePromptState}
      addSnippet={addSnippet}
      removeSnippet={removeSnippet}
      pureWords={pureWords}
      adhocTargetLanguageSentencesState={adhocTargetLanguageSentencesState}
      targetLanguageLoadedContentMaster={targetLanguageLoadedContentMaster}
      targetLanguageSnippetsState={targetLanguageSnippetsState}
    />
  );
};

export default DifficultSentences;
