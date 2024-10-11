import React, {useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useFormatWordsToStudy from '../../hooks/useFormatWordsToStudy';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import AnimatedWordModal from '../../components/WordModal';
import {setFutureReviewDate} from '../../components/ReviewSection';
import ToastMessage from '../../components/ToastMessage';
import useData from '../../context/Data/useData';

function WordStudyContainer({
  japaneseWordsState,
  japaneseAdhocLoadedSentences,
  japaneseLoadedContent,
  updateWordData,
  updatePromptState,
}): React.JSX.Element {
  const [tagsState, setTagsState] = useState([]);
  const [generalTopicState, setGeneralTopicState] = useState([]);
  const [wordStudyState, setWordStudyState] = useState([]);
  const [selectedTopicWords, setSelectedTopicWords] = useState([]);
  const [futureDaysState, setFutureDaysState] = useState(3);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedWordState, setSelectedWordState] = useState(null);

  const wordCategories = makeArrayUnique([...tagsState, ...generalTopicState]);

  const {width} = Dimensions?.get('window');
  const todayDateObj = new Date();
  const {deleteWord} = useData();

  const hasBeenReviewed = selectedWordState?.reviewHistory?.length > 0;

  useFormatWordsToStudy({
    japaneseWordsState,
    setWordStudyState,
    setTagsState,
    setGeneralTopicState,
    japaneseLoadedContent,
    japaneseAdhocLoadedSentences,
  });

  const updateExistingReviewHistory = () => {
    return [...selectedWordState?.reviewHistory, new Date()];
  };

  const setNextReviewDate = async () => {
    const reviewNotNeeded = futureDaysState === 0;
    const selectedWordId = selectedWordState.id;
    const wordBaseForm = selectedWordState.baseForm;

    const fieldToUpdate = reviewNotNeeded
      ? {
          reviewHistory: [],
          nextReview: null,
        }
      : {
          reviewHistory: hasBeenReviewed
            ? updateExistingReviewHistory()
            : [new Date()],
          nextReview: setFutureReviewDate(todayDateObj, futureDaysState),
        };

    try {
      if (reviewNotNeeded) {
        await updateWordData({
          wordId: selectedWordId,
          wordBaseForm,
          fieldToUpdate,
        });
      } else {
        await updateWordData({
          wordId: selectedWordId,
          wordBaseForm,
          fieldToUpdate,
        });
      }

      const updatedSelectedTopicWords = selectedTopicWords.map(item => {
        const thisWord = item.id === selectedWordId;
        if (thisWord) {
          return {
            ...item,
            ...fieldToUpdate,
          };
        }
        return item;
      });
      setSelectedTopicWords(updatedSelectedTopicWords);
    } catch (error) {
      console.log('## setNextReviewDate error', error);
    }
  };

  const handleShowThisCategoriesWords = category => {
    const thisCategoriesWords = wordStudyState.filter(wordData =>
      wordData.thisWordsCategories.some(
        oneCategory => oneCategory === category,
      ),
    );
    setSelectedTopicWords(thisCategoriesWords);
    setSelectedTopic(category);
  };

  const handleDeleteWord = async () => {
    if (!selectedWordState) {
      return;
    }
    const selectedWordId = selectedWordState.id;
    const wordBaseForm = selectedWordState.baseForm;
    try {
      await deleteWord({
        wordId: selectedWordId,
        wordBaseForm,
      });
    } catch (error) {
      console.log('## Error handleDeleteWord', {error});
    }
  };
  const hasSelectedTopicWords = selectedTopic && selectedTopicWords?.length > 0;

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#D3D3D3',
        minHeight: '100%',
      }}>
      {updatePromptState ? (
        <ToastMessage toastText={updatePromptState} />
      ) : null}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 5,
          }}>
          {!hasSelectedTopicWords &&
            wordCategories?.map((wordCategory, index) => {
              return (
                <View
                  key={index}
                  style={{
                    borderBlockColor: 'black',
                    borderWidth: 2,
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() => handleShowThisCategoriesWords(wordCategory)}>
                    <Text>{wordCategory}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: 'black',
            marginVertical: 10,
          }}
        />
        {hasSelectedTopicWords ? (
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
                flexWrap: 'wrap',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                }}>
                <Text>{selectedTopic}:</Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: 'gray',
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() => setSelectedTopic('')}>
                <Text>Other Topics</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 5,
              }}>
              {selectedTopicWords?.map((wordData, index) => {
                const listTextNumber = index + 1 + ') ';
                const isSelectedWord = selectedWordState?.id === wordData.id;
                return (
                  <View
                    key={wordData.id}
                    style={{
                      borderBlockColor: 'black',
                      borderWidth: 2,
                      padding: 5,
                      borderRadius: 5,
                      width: isSelectedWord ? width * 0.9 : 'auto',
                    }}>
                    <TouchableOpacity
                      onPress={() => setSelectedWordState(wordData)}>
                      <Text
                        style={{
                          fontSize: 24,
                        }}>
                        {listTextNumber}
                        {wordData.baseForm}
                      </Text>
                    </TouchableOpacity>
                    {isSelectedWord && (
                      <AnimatedWordModal
                        visible={wordData}
                        onClose={() => setSelectedWordState(null)}
                        futureDaysState={futureDaysState}
                        setFutureDaysState={setFutureDaysState}
                        setNextReviewDate={setNextReviewDate}
                        deleteWord={handleDeleteWord}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default WordStudyContainer;
