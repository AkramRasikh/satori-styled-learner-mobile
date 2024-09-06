import React from 'react';
import DifficultSentencesContainer from './DifficultSentencesContainer';
import LoadingScreen from '../../components/LoadingScreen';
import useData from '../../context/Data/useData';

const DifficultSentences = (): React.JSX.Element => {
  const data = useData();

  const dataProviderIsLoading = data.dataProviderIsLoading;
  const difficultSentencesState = data.difficultSentencesState;
  const saveAudioInstance = data.saveAudioInstance;
  const audioTempState = data.audioTempState;
  const updateSentenceData = data.updateSentenceData;
  const updatePromptState = data.updatePromptState;
  const addSnippet = data.addSnippet;
  const removeSnippet = data.removeSnippet;
  const japaneseWordsState = data.japaneseWordsState;
  const pureWords = data.pureWords;

  if (dataProviderIsLoading || !difficultSentencesState.length) {
    return <LoadingScreen>Loading difficult sentences...</LoadingScreen>;
  }

  return (
    <DifficultSentencesContainer
      difficultSentencesState={difficultSentencesState}
      saveAudioInstance={saveAudioInstance}
      audioTempState={audioTempState}
      updateSentenceData={updateSentenceData}
      updatePromptState={updatePromptState}
      addSnippet={addSnippet}
      removeSnippet={removeSnippet}
      japaneseWordsState={japaneseWordsState}
      pureWords={pureWords}
    />
  );
};

export default DifficultSentences;
