import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import DifficultSentenceWidget from '../../components/DifficultSentenceWidget';
import LoadingScreen from '../../components/LoadingScreen';
import ToastMessage from '../../components/ToastMessage';
import {calculateDueDate} from '../../utils/get-date-due-status';
import PillButton from '../../components/PillButton';
import {getTimeDiffSRS} from '../../utils/getTimeDiffSRS';

const DifficultSentencesContainer = ({
  difficultSentencesState,
  updateSentenceData,
  updatePromptState,
  addSnippet,
  removeSnippet,
  pureWords,
}): React.JSX.Element => {
  const [toggleableSentencesState, setToggleableSentencesState] = useState([]);
  const [sentenceBeingHighlightedState, setSentenceBeingHighlightedState] =
    useState('');
  const todayDateObj = new Date();

  const [isShowDueOnly, setIsShowDueOnly] = useState(false);

  const showDueInit = arr => {
    const filteredForDueOnly = [...arr].filter(sentence => {
      const dueStatus = calculateDueDate({
        todayDateObj,
        nextReview: sentence?.reviewData?.due || sentence.nextReview,
      });
      if (dueStatus < 1) {
        return true;
      }
    });
    if (filteredForDueOnly?.length > 0) {
      setToggleableSentencesState(filteredForDueOnly);
      setIsShowDueOnly(!isShowDueOnly);
    } else {
      setToggleableSentencesState(difficultSentencesState);
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
    if (difficultSentencesState?.length > 0) {
      showDueInit(difficultSentencesState);
    }
  }, [difficultSentencesState]);
  // useEffect(() => {
  //   if (toggleableSentencesState?.length > 0) {
  //     const topicsArr = [];
  //     toggleableSentencesState.forEach(sentenceData => {
  //       const sentenceTopic = getGeneralTopicName(sentenceData.topic);
  //       if (!topicsArr.includes(sentenceTopic)) {
  //         topicsArr.push(sentenceTopic);
  //       }
  //     });
  //     setTopicsAvailableState(topicsArr);
  //   } else {
  //     setTopicsAvailableState([]);
  //   }
  // }, [toggleableSentencesState]);

  if (toggleableSentencesState.length === 0) {
    return <LoadingScreen>Getting ready!</LoadingScreen>;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#D3D3D3',
        minHeight: '100%',
        marginBottom: 30,
      }}>
      {updatePromptState ? (
        <ToastMessage toastText={updatePromptState} />
      ) : null}
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
          <View style={{marginTop: 10}}>
            {toggleableSentencesState.map((sentence, index) => {
              const isLastEl = toggleableSentencesState.length === index + 1;
              const nextDueTime =
                sentence?.reviewData?.due || sentence.nextReview;
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
                  key={sentence.id}
                  sentence={sentence}
                  todayDateObj={todayDateObj}
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
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DifficultSentencesContainer;
