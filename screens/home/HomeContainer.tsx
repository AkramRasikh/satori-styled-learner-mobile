import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import MoreTopics from '../../components/MoreTopics';
import LoadingScreen from '../../components/LoadingScreen';
import HomeContainerToSentencesOrWords from '../../components/HomeContainerToSentencesOrWords';
import Topics from '../../components/Topics';
import useOnLoadContentScreen from '../../hooks/useOnLoadContentScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import useData from '../../context/Data/useData';

function Home({
  navigation,
  targetLanguageLoadedContentMasterState,
}): React.JSX.Element {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [
    targetLanguageLoadedContentState,
    setTargetLanguageLoadedContentState,
  ] = useState([]);
  const [allTopicsMetaDataState, setAllTopicsMetaDataState] = useState([]);
  const [selectedGeneralTopicState, setSelectedGeneralTopicState] =
    useState('');

  const {updateMetaDataState} = useData();

  useOnLoadContentScreen({
    targetLanguageLoadedContentMasterState,
    setTargetLanguageLoadedContentState,
    setAllTopicsMetaDataState,
    updateMetaDataState,
  });

  const handleShowTopic = topic => {
    if (topic === selectedTopic) {
      setSelectedTopic('');
    } else {
      const selectedTopicIndex =
        targetLanguageLoadedContentMasterState.findIndex(
          contentWidget => contentWidget.title === topic,
        );
      navigation.navigate('ContentScreen', {
        selectedTopicIndex,
      });
    }
  };

  const handleShowGeneralTopic = generalTopic => {
    setSelectedGeneralTopicState(generalTopic);
  };

  if (targetLanguageLoadedContentState?.length === 0) {
    return <LoadingScreen>Loading data...</LoadingScreen>;
  }

  const showNaviBtn = !(selectedGeneralTopicState || selectedTopic);

  return (
    <ScreenContainerComponent>
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
      </ScrollView>
    </ScreenContainerComponent>
  );
}

export default Home;
