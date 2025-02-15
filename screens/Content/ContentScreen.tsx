import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';

import TopicContent from '../../components/TopicContent';
import LoadingScreen from '../../components/LoadingScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';

import useData from '../../context/Data/useData';
import useDifficultSentences from '../../context/DifficultSentences/useDifficultSentencesProvider';
import {
  getEmptyCard,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../srs-algo';
import {setLearningContentStateDispatch} from '../../store/contentSlice';
import useFormatUnderlyingWords, {
  formatTextForTargetWords,
} from '../../hooks/useFormatUnderlyingWords';
import TextSegment from '../../components/TextSegment';
import useHighlightWordToWordBank from '../../hooks/useHighlightWordToWordBank';
import useInitTopicWordList from '../../hooks/useInitTopicWordList';

const ContentScreen = () => {
  const route = useRoute();

  const [selectedContentState, setSelectedContentState] = useState(null);
  const [initTargetLanguageWordsList, setInitTargetLanguageWordsList] =
    useState(null);
  const [updateWordList, setUpdateWordList] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const targetLanguageLoadedContentMasterState = useSelector(
    state => state.learningContent,
  );
  const targetLanguageLoadedWords = useSelector(state => state.words);

  const dispatch = useDispatch();

  const {
    updateSentenceViaContent,
    updateContentMetaData,
    updatePromptState,
    breakdownSentence,
    sentenceReviewBulk,
    pureWords,
  } = useData();

  const {
    removeDifficultSentenceFromState,
    updateDifficultSentence,
    addToSentenceToDifficultSentences,
  } = useDifficultSentences();

  useEffect(() => {
    if (
      isMounted &&
      targetLanguageLoadedWords?.length !== initTargetLanguageWordsList
    ) {
      setUpdateWordList(true);
      setInitTargetLanguageWordsList(targetLanguageLoadedWords.length);
    }
  }, [targetLanguageLoadedWords, initTargetLanguageWordsList, isMounted]);

  const {targetSentenceId, selectedTopicIndex} = route.params;

  const selectedTopic =
    targetLanguageLoadedContentMasterState[selectedTopicIndex].title;

  const updateContentMetaDataIsLoadedDispatch = durationsArr => {
    const updatedState = [...targetLanguageLoadedContentMasterState];
    const thisTopicData = updatedState[selectedTopicIndex];

    const removedSafeText = durationsArr.map(
      ({safeText, matchedWords, ...rest}) => rest,
    );

    const newTopicState = {
      ...thisTopicData,
      isDurationAudioLoaded: true,
      content: removedSafeText,
    };
    updatedState[selectedTopicIndex] = {
      ...newTopicState,
    };
    setSelectedContentState({
      ...selectedContentState,
      isDurationAudioLoaded: true,
      content: durationsArr,
    });

    dispatch(setLearningContentStateDispatch(updatedState));
  };

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: pureWords,
  });

  const getSafeText = targetText => {
    const textSegments = underlineWordsInSentence(targetText);
    return <TextSegment textSegments={textSegments} />;
  };

  useFormatUnderlyingWords({
    setSelectedContentState,
    loadedContent: selectedContentState,
    getSafeText,
    targetLanguageLoadedWords,
    updateWordList,
    setUpdateWordList,
  });

  useEffect(() => {
    const selectedTopicFromRedux =
      targetLanguageLoadedContentMasterState[selectedTopicIndex];
    setSelectedContentState({
      ...selectedTopicFromRedux,
      content: formatTextForTargetWords(
        selectedTopicFromRedux.content,
        getSafeText,
        targetLanguageLoadedWords,
      ),
    });
    setInitTargetLanguageWordsList(targetLanguageLoadedWords.length);
    setIsMounted(true);
  }, []);

  useInitTopicWordList({
    targetLanguageLoadedWords,
    setInitTargetLanguageWordsList,
  });

  const getThisSentenceData = (state, sentenceId) =>
    state.find(sentence => sentence.id === sentenceId);

  const updateDifficultSentencesProvider = (
    updatedContentState,
    sentenceId,
  ) => {
    const prevState = getThisSentenceData(
      selectedContentState.content,
      sentenceId,
    );
    const newState = getThisSentenceData(
      updatedContentState.content,
      sentenceId,
    );

    const initialSentenceDueState = prevState?.reviewData?.due;
    const updatedSentenceDueState = newState?.reviewData?.due;
    const isNewlyDifficulty =
      !initialSentenceDueState && updatedSentenceDueState;
    const isUpdatingDifficulty =
      initialSentenceDueState && updatedSentenceDueState;
    const isRemoveDifficulty =
      initialSentenceDueState && !updatedSentenceDueState;

    if (isNewlyDifficulty) {
      addToSentenceToDifficultSentences({
        sentenceData: newState,
      });
    } else if (isUpdatingDifficulty) {
      updateDifficultSentence({
        sentenceId,
        updateDataRes: newState,
      });
    } else if (isRemoveDifficulty) {
      removeDifficultSentenceFromState(sentenceId);
    }
  };

  const handleIsCore = async () => {
    const fieldToUpdate = {
      isCore: !Boolean(selectedContentState?.isCore),
    };
    const thisUpdatedContent = await updateContentMetaData({
      topicName: selectedTopic,
      fieldToUpdate,
      contentIndex: selectedTopicIndex,
    });
    if (thisUpdatedContent) {
      setSelectedContentState(thisUpdatedContent);
    }
  };

  const handleBulkReviews = async ({removeReview}) => {
    const emptyCard = getEmptyCard();

    const nextScheduledOptions = getNextScheduledOptions({
      card: emptyCard,
      contentType: srsRetentionKeyTypes.sentences,
    });
    const nextDueCard = nextScheduledOptions['2'].card;
    const updatedContent = await sentenceReviewBulk({
      topicName: selectedTopic,
      fieldToUpdate: {
        reviewData: nextDueCard,
      },
      contentIndex: selectedTopicIndex,
      removeReview,
    });

    if (updatedContent) {
      const updatedSelectedContent = selectedContentState.content.map(item => {
        return {
          ...item,
          reviewData: removeReview ? null : nextDueCard,
        };
      });
      setSelectedContentState({
        ...selectedContentState,
        content: updatedSelectedContent,
      });
    }
  };

  const updateSentenceDataFunc = async ({sentenceId, fieldToUpdate}) => {
    const updatedSelectedState = await updateSentenceViaContent({
      topicName: selectedTopic,
      sentenceId,
      fieldToUpdate,
      contentIndex: selectedTopicIndex,
    });
    if (updatedSelectedState) {
      setSelectedContentState(updatedSelectedState);
      updateDifficultSentencesProvider(updatedSelectedState, sentenceId);
      return true;
    }
  };

  const updateMetaData = async ({topicName, fieldToUpdate}) => {
    const thisUpdatedContent = await updateContentMetaData({
      topicName,
      fieldToUpdate,
      contentIndex: selectedTopicIndex,
    });
    if (thisUpdatedContent) {
      setSelectedContentState(thisUpdatedContent);
    }
  };

  const breakdownSentenceFunc = async ({
    topicName,
    sentenceId,
    language,
    targetLang,
    contentIndex,
  }) => {
    const updatedSelectedState = await breakdownSentence({
      topicName,
      sentenceId,
      language,
      targetLang,
      contentIndex,
    });
    if (updatedSelectedState) {
      setSelectedContentState({
        ...selectedContentState,
        content: updatedSelectedState.content,
      });
    }
  };

  if (!selectedTopic || !selectedContentState?.content) {
    return <LoadingScreen>Loading selected topic</LoadingScreen>;
  }

  return (
    <ScreenContainerComponent updatePromptState={updatePromptState}>
      <View style={{padding: 10}}>
        <TopicContent
          topicName={selectedTopic}
          loadedContent={selectedContentState}
          updateSentenceData={updateSentenceDataFunc}
          targetSentenceId={targetSentenceId}
          breakdownSentenceFunc={breakdownSentenceFunc}
          handleIsCore={handleIsCore}
          updateTopicMetaData={updateMetaData}
          handleBulkReviews={handleBulkReviews}
          updateContentMetaDataIsLoadedDispatch={
            updateContentMetaDataIsLoadedDispatch
          }
        />
      </View>
    </ScreenContainerComponent>
  );
};

export default ContentScreen;
