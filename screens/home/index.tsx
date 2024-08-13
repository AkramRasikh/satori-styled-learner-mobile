import React from 'react';
import HomeContainer from './HomeContainer';
import LoadingScreen from '../../components/LoadingScreen';

const Home = ({
  navigation,
  appIsLoading,
  homeScreenData,
}): React.JSX.Element => {
  if (!homeScreenData || appIsLoading) {
    return <LoadingScreen>Loading data...</LoadingScreen>;
  }

  return (
    <HomeContainer navigation={navigation} homeScreenData={homeScreenData} />
  );
};

export default Home;
