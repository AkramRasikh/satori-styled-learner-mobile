import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {Divider} from 'react-native-paper';
import {useSelector} from 'react-redux';
import Topics from '../../components/Topics';
import useOnLoadContentScreen from '../../hooks/useOnLoadContentScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import useData from '../../context/Data/useData';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import {clearStorage} from '../../helper-functions/local-storage-utils';
import LanguageLoadingIndicator, {
  LoadingContainer,
} from './components/LanguageLoadingIndicator';
import LanguageSelection from './components/LanguageSelection';
import ClearStorageButton from './components/ClearStorageButton';
import TranscribeTextComponent from './TranscribeTextComponent';
import HomeContainerToSentencesOrWords from '../../components/HomeContainerToSentencesOrWords';

const Home = ({navigation}): React.JSX.Element => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showMediaContentState, setShowMediaContentState] = useState('');
  const [isLoadingLanguageState, setIsLoadingLanguageState] = useState(false);
  const [allTopicsMetaDataState, setAllTopicsMetaDataState] = useState([]);
  const [selectedGeneralTopicState, setSelectedGeneralTopicState] =
    useState('');

  const {updateMetaDataState, fetchData} = useData();
  const {languageSelectedState, setLanguageSelectedState} =
    useLanguageSelector();

  const targetLanguageLoadedContentMasterState = useSelector(
    state => state.learningContent,
  );

  const handleClearStorage = async () => {
    await clearStorage();
    setLanguageSelectedState();
    setSelectedGeneralTopicState('');
    setSelectedTopic('');
    setShowMediaContentState('');
  };

  const handleLanguageSelection = async selectedLanguage => {
    try {
      setIsLoadingLanguageState(true);
      setSelectedGeneralTopicState('');
      setSelectedTopic('');
      setShowMediaContentState('');
      await fetchData(selectedLanguage);
      setLanguageSelectedState(selectedLanguage);
    } catch (error) {
    } finally {
      setIsLoadingLanguageState(false);
    }
  };

  useOnLoadContentScreen({
    targetLanguageLoadedContentMasterState,
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

  return (
    <ScreenContainerComponent>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
          padding: 10,
        }}>
        {isLoadingLanguageState && <LanguageLoadingIndicator />}
        <LoadingContainer isLoadingLanguageState={isLoadingLanguageState}>
          <LanguageSelection
            handleLanguageSelection={handleLanguageSelection}
          />
          {languageSelectedState && (
            <Divider
              style={{
                marginBottom: 10,
              }}
            />
          )}
          <HomeContainerToSentencesOrWords navigation={navigation} />
          {languageSelectedState && <TranscribeTextComponent />}
          {languageSelectedState && !selectedTopic && (
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
        </LoadingContainer>
        <ClearStorageButton handleClearStorage={handleClearStorage} />
      </ScrollView>
    </ScreenContainerComponent>
  );
};

export default Home;
