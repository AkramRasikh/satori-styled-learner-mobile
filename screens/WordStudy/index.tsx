import React from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import useData from '../../context/Data/useData';
import WordStudyContainer from './WordStudyContainer';
import {WordDataProvider} from '../../context/Data/WordDataProvider';

const WordStudyScreen = (): React.JSX.Element => {
  const data = useData();

  const dataProviderIsLoading = data.dataProviderIsLoading;
  const provdiderError = data.provdiderError;
  const japaneseWordsState = data.japaneseWordsState;
  const japaneseAdhocLoadedSentences = data.adhocJapaneseSentencesState;
  const japaneseLoadedContent = data.japaneseLoadedContentMaster;
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
    <WordDataProvider>
      <WordStudyContainer
        japaneseWordsState={japaneseWordsState}
        japaneseAdhocLoadedSentences={japaneseAdhocLoadedSentences}
        japaneseLoadedContent={japaneseLoadedContent}
        updatePromptState={updatePromptState}
      />
    </WordDataProvider>
  );
};

export default WordStudyScreen;
