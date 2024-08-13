import React from 'react';
import DifficultSentencesContainer from './DifficultSentencesContainer';
import LoadingScreen from '../../components/LoadingScreen';

const DifficultSentences = ({
  appIsLoading,
  difficultSentencesState,
}): React.JSX.Element => {
  if (appIsLoading || !difficultSentencesState.length) {
    return <LoadingScreen>Loading difficult sentences...</LoadingScreen>;
  }

  return (
    <DifficultSentencesContainer
      difficultSentencesState={difficultSentencesState}
    />
  );
};

export default DifficultSentences;
