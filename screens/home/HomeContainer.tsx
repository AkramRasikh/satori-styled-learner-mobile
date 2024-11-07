import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import TopicComponent from '../../components/TopicComponent';
import saveWordAPI from '../../api/save-word';
import {updateCreateReviewHistory} from '../../api/update-create-review-history';
import MoreTopics from '../../components/MoreTopics';
import {updateSentenceDataAPI} from '../../api/update-sentence-data';
import useLanguageSelector from '../../context/Data/useLanguageSelector';
import LoadingScreen from '../../components/LoadingScreen';
import HomeContainerToSentencesOrWords from '../../components/HomeContainerToSentencesOrWords';
import Topics from '../../components/Topics';
import useOnLoadContentScreen from '../../hooks/useOnLoadContentScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';

function Home({
  navigation,
  targetLanguageLoadedWords,
  targetLanguageLoadedContentMaster,
  targetLanguageSnippetsState,
  addSnippet,
  removeSnippet,
  setTargetLanguageWordsState,
  pureWords,
}): React.JSX.Element {
  const [structuredUnifiedData, setStructuredUnifiedData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showOtherTopics, setShowOtherTopics] = useState(true);
  const [
    targetLanguageLoadedContentState,
    setTargetLanguageLoadedContentState,
  ] = useState([]);
  const [allTopicsMetaDataState, setAllTopicsMetaDataState] = useState([]);
  const [selectedGeneralTopicState, setSelectedGeneralTopicState] =
    useState('');
  const [updatePromptState, setUpdatePromptState] = useState('');
  const [triggerSentenceIdUpdate, setTriggerSentenceIdUpdate] = useState(null);
  const [selectedContentState, setSelectedContentState] = useState({});
  const [selectedSnippetsState, setSelectedSnippetsState] = useState([]);

  const {languageSelectedState} = useLanguageSelector();

  useOnLoadContentScreen({
    targetLanguageLoadedContentMaster,
    setTargetLanguageLoadedContentState,
    setAllTopicsMetaDataState,
  });

  const handleShowTopic = topic => {
    if (topic === selectedTopic) {
      setSelectedTopic('');
      setSelectedContentState({});
      setSelectedSnippetsState([]);
    } else {
      setSelectedTopic(topic);
      setSelectedContentState(
        targetLanguageLoadedContentState.find(
          contentItem => contentItem.title === topic,
        ),
      );
      setSelectedSnippetsState(
        targetLanguageSnippetsState?.filter(item => item.topicName === topic),
      );
    }
    setShowOtherTopics(false);
  };

  const handleShowGeneralTopic = generalTopic => {
    setSelectedGeneralTopicState(generalTopic);
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
        setSelectedContentState(newTopicState);
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
        setTriggerSentenceIdUpdate({id: sentenceId, fieldToUpdate: resObj});
        setSelectedContentState(newTopicState);
        setSelectedSnippetsState(selectedContentState.snippets);
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

  const showNaviBtn = !(selectedGeneralTopicState || selectedTopic);

  return (
    <ScreenContainerComponent updatePromptState={updatePromptState}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        {selectedTopic || selectedGeneralTopicState === '' ? null : (
          <MoreTopics handleShowGeneralTopic={handleShowGeneralTopic} />
        )}
        {showNaviBtn ? (
          <HomeContainerToSentencesOrWords navigation={navigation} />
        ) : null}
        {!selectedTopic && (
          <Topics
            selectedGeneralTopicState={selectedGeneralTopicState}
            handleShowGeneralTopic={handleShowGeneralTopic}
            handleShowTopic={handleShowTopic}
            allTopicsMetaDataState={allTopicsMetaDataState}
          />
        )}
        <View>
          {selectedTopic ? (
            <TopicComponent
              topicName={selectedTopic}
              loadedContent={selectedContentState}
              loadedSnippets={selectedSnippetsState}
              pureWordsUnique={pureWords}
              structuredUnifiedData={structuredUnifiedData}
              setStructuredUnifiedData={setStructuredUnifiedData}
              targetLanguageLoadedWords={targetLanguageLoadedWords}
              addSnippet={addSnippet}
              removeSnippet={removeSnippet}
              saveWordFirebase={saveWordFirebase}
              handleOtherTopics={handleOtherTopics}
              updateTopicMetaData={updateTopicMetaData}
              updateSentenceData={updateSentenceData}
              triggerSentenceIdUpdate={triggerSentenceIdUpdate}
              setTriggerSentenceIdUpdate={setTriggerSentenceIdUpdate}
              setSelectedSnippetsState={setSelectedSnippetsState}
            />
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainerComponent>
  );
}

export default Home;
