import React from 'react';
import HomeContainer from './HomeContainer';
import LoadingScreen from '../../components/LoadingScreen';
import useData from '../../context/Data/useData';

const Home = ({navigation}): React.JSX.Element => {
  const data = useData();

  const dataProviderIsLoading = data.dataProviderIsLoading;
  const provdiderError = data.provdiderError;
  const targetLanguageLoadedContentMasterState =
    data.targetLanguageLoadedContentMasterState;

  if (dataProviderIsLoading || !targetLanguageLoadedContentMasterState) {
    return <LoadingScreen>Loading data...</LoadingScreen>;
  }
  if (provdiderError) {
    return <LoadingScreen>Error whilst loading content</LoadingScreen>;
  }

  return (
    <HomeContainer
      navigation={navigation}
      targetLanguageLoadedContentMasterState={
        targetLanguageLoadedContentMasterState
      }
    />
  );
};

export default Home;
