import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import DifficultSentenceWidget from '../../components/DifficultSentenceWidget';
import LoadingScreen from '../../components/LoadingScreen';
import {calculateDueDate} from '../../utils/get-date-due-status';
import PillButton from '../../components/PillButton';
import {getTimeDiffSRS} from '../../utils/getTimeDiffSRS';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import useLoadDifficultSentences from '../../hooks/useLoadDifficultSentences';

const todayDateObj = new Date();

const Wrapper = React.memo(
  ({
    toggleableSentencesState,
    addSnippet,
    updateSentenceData,
    removeSnippet,
    pureWords,
    sentenceBeingHighlightedState,
    setSentenceBeingHighlightedState,
    setToggleableSentencesState,
  }) => {
    return (
      <View style={{marginTop: 10}}>
        {toggleableSentencesState.map((sentence, index) => {
          const isLastEl = toggleableSentencesState.length === index + 1;
          const nextDueTime = sentence?.reviewData?.due || sentence.nextReview;
          const dueStatus = calculateDueDate({
            todayDateObj,
            nextReview: nextDueTime,
          });
          const dueDate = getTimeDiffSRS({
            dueTimeStamp: new Date(nextDueTime),
            timeNow: todayDateObj,
          });

          return (
            <DifficultSentenceWidget
              key={index}
              sentence={sentence}
              updateSentenceData={updateSentenceData}
              dueStatus={dueStatus}
              dueDate={dueDate}
              isLastEl={isLastEl}
              addSnippet={addSnippet}
              removeSnippet={removeSnippet}
              pureWords={pureWords}
              sentenceBeingHighlightedState={sentenceBeingHighlightedState}
              setSentenceBeingHighlightedState={
                setSentenceBeingHighlightedState
              }
              setToggleableSentencesState={setToggleableSentencesState}
            />
          );
        })}
      </View>
    );
  },
);

const DifficultSentencesContainer = ({
  updateSentenceData,
  updatePromptState,
  addSnippet,
  removeSnippet,
  pureWords,
  adhocTargetLanguageSentencesState,
  targetLanguageLoadedContentMaster,
  targetLanguageSnippetsState,
}): React.JSX.Element => {
  const [difficultSentencesState, setDifficultSentencesState] = useState([]);
  const [toggleableSentencesState, setToggleableSentencesState] = useState([]);
  const [sentenceBeingHighlightedState, setSentenceBeingHighlightedState] =
    useState('');

  const [isShowDueOnly, setIsShowDueOnly] = useState(false);

  const {getAllDataReady} = useLoadDifficultSentences({
    adhocTargetLanguageSentencesState,
    targetLanguageLoadedContentMaster,
    targetLanguageSnippetsState,
  });

  const showDueInit = arr => {
    const filteredForDueOnly = [...arr].filter(sentence => {
      if (sentence?.nextReview) {
        return sentence.nextReview < todayDateObj;
      } else {
        return new Date(sentence?.reviewData?.due) < todayDateObj;
      }
    });
    if (filteredForDueOnly?.length > 0) {
      setToggleableSentencesState(filteredForDueOnly);
      setIsShowDueOnly(!isShowDueOnly);
    } else {
      setToggleableSentencesState(difficultSentencesState);
    }
  };

  const updateSentenceDataScreenLevel = async ({
    isAdhoc,
    topicName,
    sentenceId,
    fieldToUpdate,
  }) => {
    try {
      await updateSentenceData({
        isAdhoc,
        topicName,
        sentenceId,
        fieldToUpdate,
      });
      setToggleableSentencesState(prev =>
        prev.filter(sentenceData => sentenceData.id !== sentenceId),
      );
    } catch (error) {
      console.log('## updateSentenceDataScreenLevel error', error);
    }
  };

  const showDueOnlyFunc = () => {
    if (!isShowDueOnly) {
      showDueInit(toggleableSentencesState);
    } else {
      setToggleableSentencesState(difficultSentencesState);
      setIsShowDueOnly(!isShowDueOnly);
    }
  };

  useEffect(() => {
    const difficultSentencesData = getAllDataReady();
    if (difficultSentencesData?.length > 0) {
      setDifficultSentencesState(difficultSentencesData);
      showDueInit(difficultSentencesData);
    }
  }, []);

  if (toggleableSentencesState.length === 0) {
    return <LoadingScreen>Getting ready!</LoadingScreen>;
  }

  return (
    <ScreenContainerComponent
      updatePromptState={updatePromptState}
      marginBottom={30}>
      <View style={{padding: 10, paddingBottom: 30}}>
        <View>
          <Text>
            Difficult Sentences: ({toggleableSentencesState.length}/
            {difficultSentencesState.length})
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: 5,
          }}>
          <PillButton
            isShowDueOnly={isShowDueOnly}
            showDueOnlyFunc={showDueOnlyFunc}
          />
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{paddingBottom: 30}}>
          <Wrapper
            toggleableSentencesState={toggleableSentencesState}
            addSnippet={addSnippet}
            updateSentenceData={updateSentenceDataScreenLevel}
            removeSnippet={removeSnippet}
            pureWords={pureWords}
            sentenceBeingHighlightedState={sentenceBeingHighlightedState}
            setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
            setToggleableSentencesState={setToggleableSentencesState}
          />
        </ScrollView>
      </View>
    </ScreenContainerComponent>
  );
};

export default DifficultSentencesContainer;
