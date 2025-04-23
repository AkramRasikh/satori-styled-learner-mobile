import React from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import useData from '../../context/Data/useData';
import WordStudyContainer from './WordStudyContainer';

const WordStudyScreen = (): React.JSX.Element => {
  const data = useData();

  const dataProviderIsLoading = data.dataProviderIsLoading;
  const provdiderError = data.provdiderError;
  if (dataProviderIsLoading) {
    return <LoadingScreen>Loading data...</LoadingScreen>;
  }
  if (provdiderError) {
    return <LoadingScreen>Error whilst loading content</LoadingScreen>;
  }

  return <WordStudyContainer />;
};

export default WordStudyScreen;
