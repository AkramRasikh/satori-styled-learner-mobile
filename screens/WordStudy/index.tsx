import React from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import useData from '../../context/Data/useData';
import WordStudyContainer from './WordStudyContainer';

const WordStudyScreen = ({navigation}): React.JSX.Element => {
  const data = useData();

  const dataProviderIsLoading = data.dataProviderIsLoading;
  const provdiderError = data.provdiderError;
  const japaneseWordsState = data.japaneseWordsState;
  const japaneseAdhocLoadedSentences = data.adhocJapaneseSentencesState;
  const japaneseLoadedContent = data.japaneseLoadedContentMaster;
  const updateWordData = data.updateWordData;
  const updatePromptState = data.updatePromptState;

  if (
    japaneseWordsState.length === 0 ||
    japaneseLoadedContent.length === 0 ||
    dataProviderIsLoading
  ) {
    return <LoadingScreen>Loading data...</LoadingScreen>;
  }
  if (provdiderError) {
    return <LoadingScreen>Error whilst loading content</LoadingScreen>;
  }

  return (
    <WordStudyContainer
      navigation={navigation}
      japaneseWordsState={japaneseWordsState}
      japaneseAdhocLoadedSentences={japaneseAdhocLoadedSentences}
      japaneseLoadedContent={japaneseLoadedContent}
      updateWordData={updateWordData}
      updatePromptState={updatePromptState}
    />
  );
};

export default WordStudyScreen;
