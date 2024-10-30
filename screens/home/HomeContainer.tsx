import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';

import TopicComponent from '../../components/TopicComponent';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import saveWordAPI from '../../api/save-word';
import useSetupPlayer from '../../hooks/useSetupPlayer';
import {updateCreateReviewHistory} from '../../api/update-create-review-history';
import MoreTopics from '../../components/MoreTopics';
import GeneralTopics from '../../components/GeneralTopics';
import TopicsToDisplay from '../../components/TopicsToDisplay';
import ToastMessage from '../../components/ToastMessage';
import {updateSentenceDataAPI} from '../../api/update-sentence-data';
import useLanguageSelector from '../../context/Data/useLanguageSelector';
import LoadingScreen from '../../components/LoadingScreen';
import HomeContainerToSentencesOrWords from '../../components/HomeContainerToSentencesOrWords';
import useTopicDescriptors from '../../hooks/useTopicDescriptors';

function Home({
  navigation,
  targetLanguageLoadedWords,
  targetLanguageLoadedContentMaster,
  targetLanguageSnippetsState,
  addSnippet,
  removeSnippet,
  setTargetLanguageWordsState,
}): React.JSX.Element {
  const [isSetupPlayerLoaded, setIsSetupPlayerLoaded] = useState(false);
  const [structuredUnifiedData, setStructuredUnifiedData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showOtherTopics, setShowOtherTopics] = useState(true);
  const [
    targetLanguageLoadedContentState,
    setTargetLanguageLoadedContentState,
  ] = useState([]);
  const [topicsToDisplayState, setTopicsToDisplayState] = useState([]);
  const [generalTopicObjKeysState, setGeneralTopicObjKeysState] = useState([]);
  const [generalTopicState, setGeneralTopicState] = useState('');
  const [updatePromptState, setUpdatePromptState] = useState('');
  const [triggerSentenceIdUpdate, setTriggerSentenceIdUpdate] = useState('');
  const [selectedContentState, setSelectedContentState] = useState({
    content: [],
    snippets: [],
  });

  const {languageSelectedState} = useLanguageSelector();

  useSetupPlayer({isSetupPlayerLoaded, setIsSetupPlayerLoaded});
  const today = new Date();

  const {
    isYoutubeVideo,
    isDueReview,
    isCoreContent,
    hasAudioCheck,
    isNeedsFutureReview,
  } = useTopicDescriptors(targetLanguageLoadedContentState, today);

  useEffect(() => {
    const targetLanguageLoadedContent = targetLanguageLoadedContentMaster.map(
      item => {
        return {
          generalTopic: item.title.split('-').slice(0, -1).join('-'),
          ...item,
        };
      },
    );
    setTargetLanguageLoadedContentState(
      targetLanguageLoadedContent.sort((a, b) => {
        return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
      }),
    );

    const topicsToDisplay = [];
    const generalTopicObjKeys = [];

    targetLanguageLoadedContent.forEach(item => {
      if (item?.generalTopic === generalTopicState) {
        topicsToDisplay.push(item.title);
      }
      if (!generalTopicObjKeys.includes(item.generalTopic)) {
        generalTopicObjKeys.push(item.generalTopic);
      }
    });
    setTopicsToDisplayState(topicsToDisplay);
    setGeneralTopicObjKeysState(generalTopicObjKeys);
  }, []);

  const getPureWords = () => {
    let pureWords = [];

    targetLanguageLoadedWords.forEach(wordData => {
      if (wordData?.baseForm) {
        pureWords.push(wordData.baseForm);
      }
      if (wordData?.surfaceForm) {
        pureWords.push(wordData.surfaceForm);
      }
    });

    const pureWordsUnique =
      pureWords?.length > 0 ? makeArrayUnique(pureWords) : [];
    return pureWordsUnique;
  };

  const handleShowTopic = topic => {
    if (topic === selectedTopic) {
      setSelectedTopic('');
    } else {
      setSelectedTopic(topic);
      setSelectedContentState({
        content: targetLanguageLoadedContentState.find(
          contentItem => contentItem.title === topic,
        ),
        snippets: targetLanguageSnippetsState?.filter(
          item => item.topicName === topic,
        ),
      });
    }
    setShowOtherTopics(false);
  };

  const handleShowGeneralTopic = generalTopic => {
    setGeneralTopicState(generalTopic);
  };

  const saveWordFirebase = async ({
    highlightedWord,
    highlightedWordSentenceId,
    contextSentence,
    isGoogle = false,
  }) => {
    try {
      const savedWord = await saveWordAPI({
        highlightedWord,
        highlightedWordSentenceId,
        contextSentence,
        isGoogle,
        language: languageSelectedState,
      });
      setTargetLanguageWordsState(prev => [...prev, savedWord]);
    } catch (error) {
      console.log('## saveWordFirebase err', error);
      setUpdatePromptState(`Error saving ${highlightedWord}!`);
      setTimeout(() => setUpdatePromptState(''), 1000);
    }
  };

  const handleOtherTopics = () => {
    setShowOtherTopics(!showOtherTopics);
    setSelectedTopic('');
  };

  const updateTopicMetaData = async ({topicName, fieldToUpdate}) => {
    try {
      const resObj = await updateCreateReviewHistory({
        contentEntry: topicName,
        fieldToUpdate,
        language: languageSelectedState,
      });
      if (resObj) {
        const thisTopicData = targetLanguageLoadedContentState.find(
          topic => topic.title === topicName,
        );
        const filterTopics = targetLanguageLoadedContentState.filter(
          topic => topic.title !== topicName,
        );
        const newTopicState = {...thisTopicData, ...resObj};
        setTargetLanguageLoadedContentState([...filterTopics, newTopicState]);
        setUpdatePromptState(`${topicName} updated!`);
        setTimeout(() => setUpdatePromptState(''), 3000);
      }
    } catch (error) {
      setUpdatePromptState(`Error updating ${topicName}!`);
      setTimeout(() => setUpdatePromptState(''), 1000);
    }
  };

  const updateSentenceData = async ({topicName, sentenceId, fieldToUpdate}) => {
    try {
      const resObj = await updateSentenceDataAPI({
        topicName,
        sentenceId,
        fieldToUpdate,
        language: languageSelectedState,
      });

      if (resObj) {
        const thisTopicDataIndex = targetLanguageLoadedContentState.findIndex(
          topic => topic.title === topicName,
        );

        const thisTopicData =
          targetLanguageLoadedContentState[thisTopicDataIndex];

        const thisTopicUpdateContent = thisTopicData.content.map(
          sentenceData => {
            if (sentenceData.id === sentenceId) {
              return {
                ...sentenceData,
                ...resObj,
              };
            }
            return sentenceData;
          },
        );

        const newTopicState = {
          ...thisTopicData,
          content: thisTopicUpdateContent,
        };

        const filteredTopics = targetLanguageLoadedContentState.map(topic => {
          if (topic.title !== topicName) {
            return topic;
          }
          return newTopicState;
        });
        setTargetLanguageLoadedContentState(filteredTopics);
        setUpdatePromptState(`${topicName} updated!`);
        setTimeout(() => setUpdatePromptState(''), 3000);
        setTriggerSentenceIdUpdate(sentenceId);
      }
    } catch (error) {
      console.log('## updateSentenceData', {error});
      setUpdatePromptState(`Error updating sentence for ${topicName}!`);
      setTimeout(() => setUpdatePromptState(''), 1000);
    }
  };

  if (targetLanguageLoadedContentState?.length === 0) {
    return <LoadingScreen>Loading data...</LoadingScreen>;
  }

  const pureWords = getPureWords();
  const showNaviBtn = !(generalTopicState || selectedTopic);

  return (
    <SafeAreaView style={{backgroundColor: '#D3D3D3', minHeight: '100%'}}>
      {updatePromptState ? (
        <ToastMessage toastText={updatePromptState} />
      ) : null}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        {selectedTopic || generalTopicState === '' ? null : (
          <MoreTopics handleShowGeneralTopic={handleShowGeneralTopic} />
        )}
        {showNaviBtn ? (
          <HomeContainerToSentencesOrWords navigation={navigation} />
        ) : null}
        {!generalTopicState && (
          <GeneralTopics
            handleShowGeneralTopic={handleShowGeneralTopic}
            generalTopicsToDisplay={generalTopicObjKeysState}
            isDueReview={isDueReview}
            isCoreContent={isCoreContent}
            isNeedsFutureReview={isNeedsFutureReview}
            isYoutubeVideo={isYoutubeVideo}
          />
        )}
        {!selectedTopic ? (
          <TopicsToDisplay
            topicsToDisplay={topicsToDisplayState}
            isDueReview={isDueReview}
            isCoreContent={isCoreContent}
            handleShowTopic={handleShowTopic}
            hasAudioCheck={hasAudioCheck}
            isNeedsFutureReview={isNeedsFutureReview}
          />
        ) : null}
        <View>
          {selectedTopic ? (
            <TopicComponent
              topicName={selectedTopic}
              loadedContent={selectedContentState.content}
              pureWordsUnique={pureWords}
              structuredUnifiedData={structuredUnifiedData}
              setStructuredUnifiedData={setStructuredUnifiedData}
              targetLanguageLoadedWords={targetLanguageLoadedWords}
              addSnippet={addSnippet}
              loadedSnippets={selectedContentState.snippets}
              removeSnippet={removeSnippet}
              saveWordFirebase={saveWordFirebase}
              handleOtherTopics={handleOtherTopics}
              updateTopicMetaData={updateTopicMetaData}
              updateSentenceData={updateSentenceData}
              triggerSentenceIdUpdate={triggerSentenceIdUpdate}
              setTriggerSentenceIdUpdate={setTriggerSentenceIdUpdate}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;
