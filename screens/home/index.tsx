import React from 'react';
import HomeContainer from './HomeContainer';
import {useSelector} from 'react-redux';

const Home = ({navigation}): React.JSX.Element => {
  const targetLanguageLoadedContentMasterState = useSelector(
    state => state.learningContent,
  );

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
