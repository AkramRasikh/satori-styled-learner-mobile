import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, View} from 'react-native';
import LoadingScreen from '../../components/LoadingScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import useData from '../../context/Data/useData';
import useDifficultSentences from '../../context/DifficultSentences/useDifficultSentencesProvider';
import WordModalDifficultSentence from '../../components/WordModalDifficultSentence';
import DifficultSentencesTopics from './DifficultSentencesTopics';
import DifficultSentencesWordNavigator from './DifficultSentencesWordNavigator';
import DifficultSentencesSegmentHeader from './DifficultSentencesSegmentHeader';
import DifficultSentenceComponent from '../../components/DifficultSentence';
import {countArrayOccurrencesToObj} from '../../utils/count-array-occurrences-to-obj';
import useOpenGoogleTranslate from '../../hooks/useOpenGoogleTranslate';
import useHighlightWordToWordBank from '../../hooks/useHighlightWordToWordBank';
import LanguageSelection from '../home/components/LanguageSelection';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';
import CombineSentencesContainer from '../../components/CombineSentencesContainer';

const DifficultSentencesContainer = ({navigation}): React.JSX.Element => {
  const [toggleableSentencesState, setToggleableSentencesState] = useState([]);
  const [selectedDueCardState, setSelectedDueCardState] = useState(null);
  const [selectedGeneralTopicState, setSelectedGeneralTopicState] =
    useState('');
  const [generalTopicsAvailableState, setGeneralTopicsAvailableState] =
    useState(null);
  const [sliceArrState, setSliceArrState] = useState(10);
  const [isShowDueOnly, setIsShowDueOnly] = useState(true);
  const [isMountedState, setIsMountedState] = useState(false);
  const [loadingCombineSentences, setLoadingCombineSentences] = useState(false);
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);

  const targetLanguageWordsState = useSelector(state => state.words);
  const numberOfWords = targetLanguageWordsState.length;
  const {updateSentenceData, deleteWord, pureWords, fetchData, updateWordData} =
    useData();

  const {
    handleCombineSentences,
    combineWordsListState,
    setCombineWordsListState,
  } = useDifficultSentences();

  const {setLanguageSelectedState} = useLanguageSelector();

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: pureWords,
  });

  const defaultScreenState = () => {
    setToggleableSentencesState([]);
    setSelectedDueCardState(null);
    setSelectedGeneralTopicState('');
    setGeneralTopicsAvailableState(null);
    setSliceArrState(10);
    setIsShowDueOnly(true);
    setIsMountedState(true);
  };

  const {
    difficultSentencesState,
    removeDifficultSentenceFromState,
    updateDifficultSentence,
  } = useDifficultSentences();

  const handleNavigationToWords = () => {
    navigation.navigate('WordStudy');
  };

  const isDueCheck = (sentence, todayDateObj) => {
    return (
      (sentence?.nextReview && sentence.nextReview < todayDateObj) ||
      new Date(sentence?.reviewData?.due) < todayDateObj
    );
  };

  const showDueInit = () => {
    const todayDateObj = new Date();
    const toggleableSentenceTopics = [];
    const filteredForDueOnly = [...difficultSentencesState].filter(sentence => {
      const isCurrentlyDue = isDueCheck(sentence, todayDateObj);

      if (sentence.generalTopic && isCurrentlyDue) {
        toggleableSentenceTopics.push(sentence.generalTopic);
      }
      return isCurrentlyDue;
    });
    if (filteredForDueOnly?.length > 0) {
      if (toggleableSentenceTopics.length > 0) {
        setGeneralTopicsAvailableState(
          countArrayOccurrencesToObj(toggleableSentenceTopics),
        );
      }
      setToggleableSentencesState(filteredForDueOnly);
    } else {
      const generalTopicsCollectively = [];
      difficultSentencesState.forEach(sentence => {
        if (sentence.generalTopic) {
          generalTopicsCollectively.push(sentence.generalTopic);
        }
      });
      setToggleableSentencesState(difficultSentencesState);
      if (generalTopicsCollectively.length > 0) {
        setGeneralTopicsAvailableState(
          countArrayOccurrencesToObj(generalTopicsCollectively),
        );
      }
    }
  };

  const handleShowThisTopicsSentences = topic => {
    if (topic === selectedGeneralTopicState) {
      setSelectedGeneralTopicState('');
    } else {
      setSelectedGeneralTopicState(topic);
    }
  };

  const handleWordUpdate = wordData => {
    updateWordData(wordData);
    setSelectedDueCardState(null);
  };

  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const updateSentenceDataScreenLevel = async ({
    isAdhoc,
    topicName,
    sentenceId,
    fieldToUpdate,
    contentIndex,
  }) => {
    const isRemoveFromDifficultSentences = fieldToUpdate?.nextReview === null;

    if (isRemoveFromDifficultSentences) {
      removeDifficultSentenceFromState(sentenceId);
    } else {
      updateDifficultSentence({sentenceId, updateDataRes: fieldToUpdate});
    }

    await updateSentenceData({
      isAdhoc,
      topicName,
      sentenceId,
      fieldToUpdate,
      contentIndex,
      isRemoveReview: isRemoveFromDifficultSentences,
    });
  };

  const handleExportListToAI = async () => {
    try {
      setLoadingCombineSentences(true);
      await handleCombineSentences();
    } catch (error) {
    } finally {
      setLoadingCombineSentences(true);
    }
  };

  const handleSelectWord = selectingWord => {
    const mostUpToDateWord = targetLanguageWordsState.find(
      i => i.id === selectingWord.id,
    );
    if (mostUpToDateWord) {
      setSelectedDueCardState(mostUpToDateWord);
    }
  };

  const handleDeleteWord = async () => {
    await deleteWord({
      wordId: selectedDueCardState.id,
      wordBaseForm: selectedDueCardState.baseForm,
    });
    setSelectedDueCardState(null);
  };

  useEffect(() => {
    if (isMountedState) {
      const todayDateObj = new Date();

      const toggleableSentenceTopics = [];

      const updatedToggleStateWithSelectedTopic = [
        ...difficultSentencesState,
      ].filter(i => {
        const thisTopic =
          !selectedGeneralTopicState ||
          i.generalTopic === selectedGeneralTopicState;
        const timeCheckEligibility =
          !isShowDueOnly || isDueCheck(i, todayDateObj);
        if (timeCheckEligibility) {
          toggleableSentenceTopics.push(i.generalTopic);
        }

        return (
          (!selectedGeneralTopicState || thisTopic) && timeCheckEligibility
        );
      });
      setToggleableSentencesState(updatedToggleStateWithSelectedTopic);
      setGeneralTopicsAvailableState(
        countArrayOccurrencesToObj(toggleableSentenceTopics),
      );
    }
  }, [
    difficultSentencesState,
    selectedGeneralTopicState,
    isShowDueOnly,
    isMountedState,
  ]);

  const handleLanguageSelection = async selectedLanguage => {
    try {
      setIsLanguageLoading(true);
      defaultScreenState();
      await fetchData(selectedLanguage);
      setLanguageSelectedState(selectedLanguage);
    } catch (error) {
    } finally {
      setIsLanguageLoading(false);
    }
  };

  useEffect(() => {
    setIsMountedState(true);
    showDueInit(difficultSentencesState);
  }, []);

  if (difficultSentencesState.length === 0) {
    return <LoadingScreen>Getting ready!</LoadingScreen>;
  }

  const realCapacity = toggleableSentencesState.length;
  const slicedRenderedSentenceArr = toggleableSentencesState.slice(
    0,
    sliceArrState,
  );
  const toggleableSentencesStateLength = slicedRenderedSentenceArr.length;

  return (
    <ScreenContainerComponent marginBottom={30}>
      {combineWordsListState?.length ? (
        <CombineSentencesContainer
          combineWordsListState={combineWordsListState}
          setCombineWordsListState={setCombineWordsListState}
          handleExportListToAI={handleExportListToAI}
          isLoading={loadingCombineSentences}
        />
      ) : null}
      {isLanguageLoading && (
        <ActivityIndicator
          animating={true}
          color={MD2Colors.amber300}
          size="large"
          style={{
            position: 'absolute',
            top: '40%',
            alignSelf: 'center',
          }}
        />
      )}
      <LanguageSelection handleLanguageSelection={handleLanguageSelection} />
      <View
        style={{
          padding: 10,
          paddingBottom: 70,
          opacity: isLanguageLoading ? 0.5 : 1,
        }}>
        {selectedDueCardState && (
          <WordModalDifficultSentence
            visible={selectedDueCardState}
            updateWordData={handleWordUpdate}
            onClose={() => setSelectedDueCardState(null)}
            deleteWord={() => handleDeleteWord(selectedDueCardState)}
          />
        )}
        <DifficultSentencesSegmentHeader
          dueLength={toggleableSentencesState.length}
          allLength={difficultSentencesState.length}
          isShowDueOnly={isShowDueOnly}
          setIsShowDueOnly={setIsShowDueOnly}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{paddingBottom: 30}}>
          {generalTopicsAvailableState ? (
            <DifficultSentencesTopics
              generalTopicsAvailableState={generalTopicsAvailableState}
              handleShowThisTopicsSentences={handleShowThisTopicsSentences}
              selectedGeneralTopicState={selectedGeneralTopicState}
            />
          ) : null}
          <DifficultSentencesWordNavigator
            handleNavigationToWords={handleNavigationToWords}
            numberOfWords={numberOfWords}
          />
          <View style={{marginTop: 10}}>
            {slicedRenderedSentenceArr.map((sentence, index) => {
              const nextAudioIsTheSameUrl =
                sentence.isMediaContent &&
                sentence.topic === slicedRenderedSentenceArr[index + 1]?.topic;
              return (
                <DifficultSentenceComponent
                  key={sentence.id}
                  toggleableSentencesStateLength={
                    toggleableSentencesStateLength
                  }
                  updateSentenceData={updateSentenceDataScreenLevel}
                  navigation={navigation}
                  sliceArrState={sliceArrState}
                  setSliceArrState={setSliceArrState}
                  realCapacity={realCapacity}
                  handleSelectWord={handleSelectWord}
                  handleWordUpdate={handleWordUpdate}
                  sentence={sentence}
                  openGoogleTranslateApp={openGoogleTranslateApp}
                  indexNum={index}
                  underlineWordsInSentence={underlineWordsInSentence}
                  combineWordsListState={combineWordsListState}
                  setCombineWordsListState={setCombineWordsListState}
                  nextAudioIsTheSameUrl={nextAudioIsTheSameUrl}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    </ScreenContainerComponent>
  );
};

export default DifficultSentencesContainer;
