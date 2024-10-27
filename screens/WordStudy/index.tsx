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
  const targetLanguageLoadedSentences = data.adhocJapaneseSentencesState;
  const targetLanguageLoadedContent = data.targetLanguageLoadedContentMaster;
  const updatePromptState = data.updatePromptState;

  if (
    japaneseWordsState.length === 0 ||
    targetLanguageLoadedContent.length === 0 ||
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
        targetLanguageLoadedSentences={targetLanguageLoadedSentences}
        targetLanguageLoadedContent={targetLanguageLoadedContent}
        updatePromptState={updatePromptState}
      />
    </WordDataProvider>
  );
};

export default WordStudyScreen;
