import React from 'react';
import DifficultSentencesContainer from './DifficultSentencesContainer';
import LoadingScreen from '../../components/LoadingScreen';
import useData from '../../context/Data/useData';

const DifficultSentences = ({appIsLoading}): React.JSX.Element => {
  const data = useData();

  const dataProviderIsLoading = data.dataProviderIsLoading;
  const difficultSentencesState = data.difficultSentencesState;

  if (
    appIsLoading ||
    dataProviderIsLoading ||
    !difficultSentencesState.length
  ) {
    return <LoadingScreen>Loading difficult sentences...</LoadingScreen>;
  }

  return (
    <DifficultSentencesContainer
      difficultSentencesState={difficultSentencesState}
    />
  );
};

export default DifficultSentences;
