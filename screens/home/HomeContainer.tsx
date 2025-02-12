import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, FAB, Text} from 'react-native-paper';
import LoadingScreen from '../../components/LoadingScreen';
import HomeContainerToSentencesOrWords, {
  languageEmojiKey,
} from '../../components/HomeContainerToSentencesOrWords';
import Topics from '../../components/Topics';
import useOnLoadContentScreen from '../../hooks/useOnLoadContentScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import useData from '../../context/Data/useData';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import {clearStorage} from '../../helper-functions/local-storage-utils';

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
        <View style={{padding: 10, borderWidth: 1, borderRadius: 10}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View>
              <Text
                style={{
                  fontSize: 35,
                  shadowOffset: {
                    width: 3,
                    height: 3,
                  },
                  shadowOpacity: 0.3,
                }}>
                {languageEmojiKey[languageSelectedState]}
              </Text>
            </View>
            <HomeContainerToSentencesOrWords navigation={navigation} />
          </View>

          {!selectedTopic && (
            <Topics
              setSelectedGeneralTopicState={setSelectedGeneralTopicState}
              selectedGeneralTopicState={selectedGeneralTopicState}
              handleShowGeneralTopic={handleShowGeneralTopic}
              handleShowTopic={handleShowTopic}
              allTopicsMetaDataState={allTopicsMetaDataState}
            />
          )}
        </View>
        <View style={{padding: 10, gap: 10, marginVertical: 30}}>
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
        <Button
          icon="backup-restore"
          mode="contained-tonal"
          onPress={clearStorage}
          labelStyle={{
            fontStyle: 'italic',
          }}>
          Clear Storage
        </Button>
      </ScrollView>
    </ScreenContainerComponent>
  );
}

export default Home;
