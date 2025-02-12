import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import LoadingScreen from '../../components/LoadingScreen';
import HomeContainerToSentencesOrWords, {
  languageEmojiKey,
} from '../../components/HomeContainerToSentencesOrWords';
import Topics from '../../components/Topics';
import useOnLoadContentScreen from '../../hooks/useOnLoadContentScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import useData from '../../context/Data/useData';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import {FAB} from 'react-native-paper';

const languages = ['japanese', 'chinese'];

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

  const {updateMetaDataState, fetchData} = useData();
  const {languageSelectedState, setLanguageSelectedState} =
    useLanguageSelector();

  const handleLanguageSelection = async selectedLanguage => {
    await fetchData(selectedLanguage);
    setLanguageSelectedState(selectedLanguage);
  };

  useOnLoadContentScreen({
    targetLanguageLoadedContentMasterState,
    setTargetLanguageLoadedContentState,
    setAllTopicsMetaDataState,
    updateMetaDataState,
    languageSelectedState,
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

  return (
    <ScreenContainerComponent>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        <HomeContainerToSentencesOrWords navigation={navigation} />

        {!selectedTopic && (
          <Topics
            setSelectedGeneralTopicState={setSelectedGeneralTopicState}
            selectedGeneralTopicState={selectedGeneralTopicState}
            handleShowGeneralTopic={handleShowGeneralTopic}
            handleShowTopic={handleShowTopic}
            allTopicsMetaDataState={allTopicsMetaDataState}
          />
        )}
        <View style={{padding: 10, gap: 10, marginTop: 50}}>
          {languages.map(item => {
            if (item !== languageSelectedState) {
              const emojiFlag = languageEmojiKey[item];

              return (
                <FAB
                  key={item}
                  label={`Get ${item} content! ${emojiFlag}`}
                  onPress={async () => {
                    await handleLanguageSelection(item);
                  }}
                />
              );
            } else {
              return null;
            }
          })}
        </View>
      </ScrollView>
    </ScreenContainerComponent>
  );
}

export default Home;
