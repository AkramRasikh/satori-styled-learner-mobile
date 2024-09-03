import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DifficultSentenceWidget from '../../components/DifficultSentenceWidget';
import LoadingScreen from '../../components/LoadingScreen';
import {sortByDueDate} from '../../utils/sort-by-due-date';
import ToastMessage from '../../components/ToastMessage';
import {calculateDueDate} from '../../utils/get-date-due-status';
import PillButton from '../../components/PillButton';
// import {getGeneralTopicName} from '../../utils/get-general-topic-name';
// import {getThisTopicsWords} from '../../helper-functions/get-this-topics-words';

const DifficultSentencesContainer = ({
  difficultSentencesState,
  saveAudioInstance,
  audioTempState,
  updateSentenceData,
  updatePromptState,
  addSnippet,
  removeSnippet,
}): React.JSX.Element => {
  const [toggleableSentencesState, setToggleableSentencesState] = useState([]);
  const todayDateObj = new Date();

  const [isShowDueOnly, setIsShowDueOnly] = useState(false);
  // const [topicsAvailableState, setTopicsAvailableState] = useState([]);
  // const [selectedTopic, setSelectedTopic] = useState('');

  // const getBySelectedTopic = () => {};

  // useEffect(() => {
  //   if (selectedTopic) {
  //     const thisTopicsSentences = [...toggleableSentencesState].filter(
  //       sentenceData =>
  //         getThisTopicsWords(sentenceData.topic) === selectedTopic,
  //     );

  //     setToggleableSentencesState(thisTopicsSentences);
  //   } else {
  //     setToggleableSentencesState(difficultSentencesState);
  //   }
  // }, [selectedTopic, toggleableSentencesState]);

  const showDueOnlyFunc = () => {
    if (!isShowDueOnly) {
      const filteredForDueOnly = [...toggleableSentencesState].filter(
        sentence => {
          const dueStatus = calculateDueDate({
            todayDateObj,
            nextReview: sentence.nextReview,
          });
          if (dueStatus < 1) {
            return true;
          }
        },
      );
      setToggleableSentencesState(filteredForDueOnly);
      setIsShowDueOnly(!isShowDueOnly);
    } else {
      setToggleableSentencesState(difficultSentencesState);
      setIsShowDueOnly(!isShowDueOnly);
    }
  };

  const btnText = '↕ In Due order ✅';
  const btnDueText = `Show only due ${isShowDueOnly ? '✅' : '❌'}`;

  useEffect(() => {
    if (difficultSentencesState?.length > 0) {
      setToggleableSentencesState(difficultSentencesState);
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

        {/* <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 5,
            alignSelf: 'center',
            marginBottom: 5,
          }}>
          {topicsAvailableState?.map(generalTopic => {
            return (
              <TouchableOpacity
                key={generalTopic}
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() => setSelectedTopic(generalTopic)}>
                <Text>{generalTopic}</Text>
              </TouchableOpacity>
            );
          })}
        </View> */}
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{paddingBottom: 30}}>
          <View style={{marginTop: 10}}>
            {toggleableSentencesState.map((sentence, index) => {
              const isLastEl = toggleableSentencesState.length === index + 1;
              const dueStatus = calculateDueDate({
                todayDateObj,
                nextReview: sentence.nextReview,
              });
              return (
                <DifficultSentenceWidget
                  key={sentence.id}
                  sentence={sentence}
                  todayDateObj={todayDateObj}
                  saveAudioInstance={saveAudioInstance}
                  audioTempState={audioTempState}
                  updateSentenceData={updateSentenceData}
                  dueStatus={dueStatus}
                  isLastEl={isLastEl}
                  addSnippet={addSnippet}
                  removeSnippet={removeSnippet}
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
