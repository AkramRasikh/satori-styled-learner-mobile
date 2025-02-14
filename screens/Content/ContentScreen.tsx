import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';

import TopicContent from '../../components/TopicContent';
import LoadingScreen from '../../components/LoadingScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';

import useData from '../../context/Data/useData';
import useDifficultSentences from '../../context/DifficultSentences/useDifficultSentencesProvider';
import {TopicContentSnippetsProvider} from '../../components/TopicContent/context/TopicContentSnippetsProvider';
import {TopicContentAudioProvider} from '../../components/TopicContent/context/TopicContentAudioProvider';
import {
  getEmptyCard,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../srs-algo';

const ContentScreen = () => {
  const route = useRoute();

  const [triggerSentenceIdUpdate, setTriggerSentenceIdUpdate] = useState(null);
  const [selectedContentState, setSelectedContentState] = useState(null);
  const [selectedSnippetsState, setSelectedSnippetsState] = useState([]);
  const [formattedData, setFormattedData] = useState([]);

  const targetLanguageLoadedContentMasterState = useSelector(
    state => state.learningContent,
  );

  const {
    updateSentenceViaContent,
    updateContentMetaData,
    updatePromptState,
    breakdownSentence,
    sentenceReviewBulk,
    structuredUnifiedData,
    setStructuredUnifiedData,
  } = useData();

  const {
    removeDifficultSentenceFromState,
    updateDifficultSentence,
    addToSentenceToDifficultSentences,
  } = useDifficultSentences();

  const {targetSentenceId, selectedTopicIndex} = route.params;

  const selectedTopic =
    targetLanguageLoadedContentMasterState[selectedTopicIndex].title;

  useEffect(() => {
    setSelectedContentState(
      targetLanguageLoadedContentMasterState[selectedTopicIndex],
    );
  }, []);

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
      const updatedFormattedData = formattedData.map(item => {
        return {
          ...item,
          reviewData: removeReview ? null : nextDueCard,
        };
      });
      setFormattedData(updatedFormattedData);
      setStructuredUnifiedData(prevState => ({
        ...prevState,
        [selectedTopic]: {content: updatedFormattedData},
      }));
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
      setTriggerSentenceIdUpdate(sentenceId);
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
      setSelectedContentState(updatedSelectedState);
      setTriggerSentenceIdUpdate(sentenceId);
    }
  };

  if (!selectedTopic || !selectedContentState?.content) {
    return <LoadingScreen>Loading selected topic</LoadingScreen>;
  }

  return (
    <ScreenContainerComponent updatePromptState={updatePromptState}>
      <View style={{padding: 10}}>
        <TopicContentAudioProvider
          topicName={selectedTopic}
          realStartTime={selectedContentState?.realStartTime}>
          <TopicContentSnippetsProvider
            topicName={selectedTopic}
            loadedContent={selectedContentState}
            selectedSnippetsState={selectedSnippetsState}
            setSelectedSnippetsState={setSelectedSnippetsState}>
            <TopicContent
              topicName={selectedTopic}
              loadedContent={selectedContentState}
              updateSentenceData={updateSentenceDataFunc}
              triggerSentenceIdUpdate={triggerSentenceIdUpdate}
              setTriggerSentenceIdUpdate={setTriggerSentenceIdUpdate}
              targetSentenceId={targetSentenceId}
              breakdownSentenceFunc={breakdownSentenceFunc}
              handleIsCore={handleIsCore}
              formattedData={formattedData}
              setFormattedData={setFormattedData}
              updateTopicMetaData={updateMetaData}
              handleBulkReviews={handleBulkReviews}
              structuredUnifiedData={structuredUnifiedData}
              setStructuredUnifiedData={setStructuredUnifiedData}
            />
          </TopicContentSnippetsProvider>
        </TopicContentAudioProvider>
      </View>
    </ScreenContainerComponent>
  );
};

export default ContentScreen;
