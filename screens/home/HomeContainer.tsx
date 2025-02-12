import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  DefaultTheme,
  Divider,
  MD3Colors,
  Text,
} from 'react-native-paper';
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

const LanguageFlagComponent = ({text}) => (
  <Text
    style={{
      fontSize: 35,
      shadowOffset: {
        width: 3,
        height: 3,
      },
      shadowOpacity: 0.3,
    }}>
    {text}
  </Text>
);

function Home({
  navigation,
  targetLanguageLoadedContentMasterState,
}): React.JSX.Element {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showMediaContentState, setShowMediaContentState] = useState('');
  const [isLoadingLanguageState, setIsLoadingLanguageState] = useState(false);
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
    try {
      setIsLoadingLanguageState(true);
      await fetchData(selectedLanguage);
      setSelectedGeneralTopicState('');
      setSelectedTopic('');
      setShowMediaContentState('');
      setLanguageSelectedState(selectedLanguage);
    } catch (error) {
    } finally {
      setIsLoadingLanguageState(false);
    }
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
        style={{
          padding: 10,
        }}>
        {isLoadingLanguageState && (
          <ActivityIndicator
            style={{
              position: 'absolute',
              alignSelf: 'center',
              zIndex: 100,
              top: '50%',
            }}
            size="large"
          />
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity: isLoadingLanguageState ? 0.5 : 1,
            gap: 50,
          }}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={DefaultTheme.fonts.labelLarge}>Selected: </Text>
                <LanguageFlagComponent
                  text={languageEmojiKey[languageSelectedState]}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}>
                <Text style={DefaultTheme.fonts.labelMedium}>Options:</Text>
                {languages.map(item => {
                  if (item !== languageSelectedState) {
                    const emojiFlag = languageEmojiKey[item];

                    return (
                      <TouchableOpacity
                        key={item}
                        onPress={async () => {
                          await handleLanguageSelection(item);
                        }}>
                        <LanguageFlagComponent text={emojiFlag} />
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })}
              </View>
            </View>
            <Divider
              style={{
                marginVertical: 15,
              }}
            />
            <HomeContainerToSentencesOrWords navigation={navigation} />
            {!selectedTopic && (
              <Topics
                setSelectedGeneralTopicState={setSelectedGeneralTopicState}
                selectedGeneralTopicState={selectedGeneralTopicState}
                handleShowGeneralTopic={handleShowGeneralTopic}
                handleShowTopic={handleShowTopic}
                allTopicsMetaDataState={allTopicsMetaDataState}
                showMediaContentState={showMediaContentState}
                setShowMediaContentState={setShowMediaContentState}
              />
            )}
          </View>
          <Button
            icon="backup-restore"
            mode="contained"
            buttonColor={MD3Colors.error30}
            onPress={clearStorage}
            labelStyle={{
              fontStyle: 'italic',
            }}>
            Clear Storage
          </Button>
        </View>
      </ScrollView>
    </ScreenContainerComponent>
  );
}

export default Home;
