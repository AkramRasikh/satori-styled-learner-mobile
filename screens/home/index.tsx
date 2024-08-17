import React from 'react';
import HomeContainer from './HomeContainer';
import LoadingScreen from '../../components/LoadingScreen';
import useData from '../../context/Data/useData';

const Home = ({navigation}): React.JSX.Element => {
  const data = useData();

  const dataProviderIsLoading = data.dataProviderIsLoading;
  const provdiderError = data.provdiderError;
  const homeScreenData = data.homeScreenData;
  const japaneseLoadedContentMaster = data.japaneseLoadedContentMaster;

  if (!homeScreenData || dataProviderIsLoading) {
    return <LoadingScreen>Loading data...</LoadingScreen>;
  }
  if (provdiderError) {
    return <LoadingScreen>Error whilst loading content</LoadingScreen>;
  }

  return (
    <HomeContainer
      navigation={navigation}
      homeScreenData={homeScreenData}
      japaneseLoadedContentMaster={japaneseLoadedContentMaster}
    />
  );
};

export default Home;
