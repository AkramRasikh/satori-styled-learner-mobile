import React from 'react';
import HomeContainer from './HomeContainer';
import LoadingScreen from '../../components/LoadingScreen';
import useData from '../../context/Data/useData';

const Home = ({navigation}): React.JSX.Element => {
  const data = useData();

  const dataProviderIsLoading = data.dataProviderIsLoading;
  const provdiderError = data.provdiderError;
  const homeScreenData = data.homeScreenData;
  const targetLanguageLoadedContentMaster =
    data.targetLanguageLoadedContentMaster;
  const targetLanguageSnippetsState = data.targetLanguageSnippetsState;
  const addSnippet = data.addSnippet;
  const removeSnippet = data.removeSnippet;
  const targetLanguageLoadedWords = data.targetLanguageWordsState;
  const setTargetLanguageWordsState = data.setTargetLanguageWordsState;
  const pureWords = data.pureWords;

  if (
    !homeScreenData ||
    dataProviderIsLoading ||
    !targetLanguageLoadedContentMaster
  ) {
    return <LoadingScreen>Loading data...</LoadingScreen>;
  }
  if (provdiderError) {
    return <LoadingScreen>Error whilst loading content</LoadingScreen>;
  }

  return (
    <HomeContainer
      navigation={navigation}
      targetLanguageLoadedWords={targetLanguageLoadedWords}
      targetLanguageLoadedContentMaster={targetLanguageLoadedContentMaster}
      targetLanguageSnippetsState={targetLanguageSnippetsState}
      addSnippet={addSnippet}
      removeSnippet={removeSnippet}
      setTargetLanguageWordsState={setTargetLanguageWordsState}
      pureWords={pureWords}
    />
  );
};

export default Home;
