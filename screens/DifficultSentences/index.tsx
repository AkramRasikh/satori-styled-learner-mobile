import React from 'react';
import DifficultSentencesContainer from './DifficultSentencesContainer';
import LoadingScreen from '../../components/LoadingScreen';
import useData from '../../context/Data/useData';

const DifficultSentences = ({navigation}): React.JSX.Element => {
  const data = useData();

  const dataProviderIsLoading = data.dataProviderIsLoading;

  if (dataProviderIsLoading) {
    return <LoadingScreen>Loading difficult sentences...</LoadingScreen>;
  }

  return <DifficultSentencesContainer navigation={navigation} />;
};

export default DifficultSentences;
