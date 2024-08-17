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

  if (dataProviderIsLoading || !difficultSentencesState.length) {
    return <LoadingScreen>Loading difficult sentences...</LoadingScreen>;
  }

  return (
    <DifficultSentencesContainer
      difficultSentencesState={difficultSentencesState}
      saveAudioInstance={saveAudioInstance}
      audioTempState={audioTempState}
      updateSentenceData={updateSentenceData}
    />
  );
};

export default DifficultSentences;
