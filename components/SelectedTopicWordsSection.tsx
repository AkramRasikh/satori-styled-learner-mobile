import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AnimatedWordModal from './WordModal';
import SRSToggles from './SRSToggles';
import {PillButtonScaled} from './PillButton';
import {sortByDueDateWords} from '../utils/sort-by-due-date';
import useData from '../context/Data/useData';
import AnimatedModal from './AnimatedModal';

const SingleSentence = ({item, handleGetAudio, handleSaveSentence}) => {
  const id = item?.id;
  const matchedWords = item?.matchedWords;
  const hasAudio = item?.hasAudio;
  const isSaved = item?.isSaved;
  const targetLang = item?.targetLang;

  return (
    <View key={item.id} style={{display: 'flex', gap: 10}}>
      <Text style={{fontSize: 20}}>{item.targetLang}</Text>
      <Text style={{fontSize: 20}}>{item.baseLang}</Text>
      {matchedWords?.length > 0 ? (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
          {matchedWords?.map((matchedWord, index) => {
            const isLast = index === matchedWords.length - 1;
            return (
              <Text style={{fontSize: 20}}>
                {matchedWord} {isLast ? '' : ', '}
              </Text>
            );
          })}
        </View>
      ) : null}
      {!hasAudio ? (
        <TouchableOpacity
          onPress={() => handleGetAudio({id, sentence: targetLang})}>
          <Text>Get Audio</Text>
        </TouchableOpacity>
      ) : null}
      {!isSaved ? (
        <TouchableOpacity onPress={() => handleSaveSentence(item)}>
          <Text>Save</Text>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            backgroundColor: 'green',
          }}>
          <Text>Saved!!! ✅</Text>
        </View>
      )}
    </View>
  );
};

const CombineSentenceResponseModal = ({
  combineWordsListState,
  handleGetAudio,
  handleSaveSentence,
}) => {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {combineWordsListState?.map(item => (
        <SingleSentence
          key={item.id}
          item={item}
          handleGetAudio={handleGetAudio}
          handleSaveSentence={handleSaveSentence}
        />
      ))}
    </ScrollView>
  );
};

const SelectedTopicWordsSection = ({
  selectedTopicWords,
  selectedWordState,
  setSelectedWordState,
  handleDeleteWord,
  selectedTopic,
  setSelectedTopic,
}) => {
  const [flashcardState, setFlashcardState] = useState([]);
  const [initCombineWordsListState, setInitCombineWordsListState] = useState(
    [],
  );
  const [isShowOptionA, setIsShowOptionA] = useState(true);

  const {
    combineWordsListState,
    loadingCombineSentences,
    combineWords,
    setCombineWordsListState,
    addSentenceContext,
    getSentenceAudio,
  } = useData();

  const {width} = Dimensions?.get('window');

  const handleToggleDueState = () => {
    if (isShowOptionA) {
      const sortedFlashCards = [...selectedTopicWords].sort(sortByDueDateWords);
      setFlashcardState(sortedFlashCards);
      setIsShowOptionA(false);
    } else {
      setFlashcardState(selectedTopicWords);
      setIsShowOptionA(true);
    }
  };

  const handleCombineSentences = () => {
    const inputWords = initCombineWordsListState.map(item => {
      return {
        word: item.baseForm,
        wordDefinition: item.definition,
        context: item.contextData[0].targetLang,
      };
    });

    combineWords({inputWords});
  };

  const handleCloseModal = () => {
    setCombineWordsListState([]);
  };

  const handleGetAudio = async ({id, sentence}) => {
    const audioIdRes = await getSentenceAudio({id, sentence});

    if (audioIdRes) {
      const updatedCombineWordsListState = combineWordsListState.map(item => {
        if (audioIdRes === item.id) {
          return {
            hasAudio: true,
            ...item,
          };
        }

        return item;
      });
      setCombineWordsListState(updatedCombineWordsListState);
    }
  };

  const handleSaveSentence = async contextSentenceToSave => {
    const contextData = {
      id: contextSentenceToSave.id,
      baseLang: contextSentenceToSave.baseLang,
      targetLang: contextSentenceToSave.targetLang,
      matchedWords: contextSentenceToSave.matchedWords,
      tokenised: contextSentenceToSave.tokenised,
    };

    const idsOfSavedSentences = await addSentenceContext(contextData);
    // console.log('## handleSaveSentence', {
    //   pre: contextSentenceToSave.id,
    //   post: idsOfSavedSentences,
    // });

    const updatedCombinedSentnece = combineWordsListState.map(item => {
      return {
        ...item,
        isSaved: item.id === contextSentenceToSave.id,
      };
    });
    setCombineWordsListState(updatedCombinedSentnece);
    // nest in
  };

  const addToConbinedWords = (wordDataToBasket, inBasket) => {
    if (inBasket) {
      setInitCombineWordsListState(prev =>
        prev.filter(item => item.id !== wordDataToBasket.id),
      );
      return;
    }
    if (
      !initCombineWordsListState.some(item => item.id === wordDataToBasket.id)
    ) {
      setInitCombineWordsListState(prev => [...prev, wordDataToBasket]);
    }
  };

  useEffect(() => {
    setFlashcardState(selectedTopicWords);
  }, [selectedTopicWords]);

  return (
    <View>
      {combineWordsListState?.length > 0 ? (
        <View
          style={{
            width: '100%',
            paddingVertical: 10,
            marginVertical: 10,
          }}>
          <AnimatedModal visible onClose={handleCloseModal}>
            <CombineSentenceResponseModal
              combineWordsListState={combineWordsListState}
              handleGetAudio={handleGetAudio}
              handleSaveSentence={handleSaveSentence}
            />
          </AnimatedModal>
        </View>
      ) : null}
      {loadingCombineSentences ? (
        <View>
          <Text>...Data Loading</Text>
        </View>
      ) : null}
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
      {initCombineWordsListState.length > 0 ? (
        <View
          style={{
            marginVertical: 10,
            display: 'flex',
            gap: 10,
          }}>
          <View>
            {initCombineWordsListState.map((wordDataInBasket, index) => {
              const basketText = `${index + 1} ${wordDataInBasket.baseForm} - ${
                wordDataInBasket.definition
              }`;
              return (
                <View
                  key={wordDataInBasket.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    {basketText}
                  </Text>
                  <TouchableOpacity
                    onPress={() => addToConbinedWords(wordDataInBasket, true)}>
                    <Text>❌</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <View
            style={{
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={handleCombineSentences}
              style={{
                backgroundColor: 'gray',
                padding: 5,
                borderRadius: 10,
              }}>
              <Text>Combine sentences</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      <View
        style={{
          marginBottom: 10,
          alignItems: 'center',
        }}>
        <PillButtonScaled
          isShowOptionA={isShowOptionA}
          toggleOption={() => handleToggleDueState()}
          textA={'Default'}
          textB={'Due order'}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 5,
        }}>
        {flashcardState?.map((wordData, index) => {
          const listTextNumber = index + 1 + ') ';
          const wordId = wordData.id;
          const isSelectedWord = selectedWordState?.id === wordId;
          const isCardDue = wordData?.isCardDue;
          const baseForm = wordData?.baseForm;
          const cardReviewButNotDue = !isCardDue && wordData?.reviewData?.due;
          const inBasket =
            initCombineWordsListState.length > 0 &&
            initCombineWordsListState.some(item => item.id === wordId);
          const contextNum = wordData.contexts?.length;

          return (
            <View
              key={wordData.id}
              style={{
                borderBlockColor: 'black',
                borderWidth: 2,
                padding: 5,
                borderRadius: 5,
                width: isSelectedWord ? width * 0.9 : 'auto',
                backgroundColor: cardReviewButNotDue
                  ? '#ADD8E6'
                  : isCardDue && 'pink',
              }}>
              <TouchableOpacity onPress={() => setSelectedWordState(wordData)}>
                <Text
                  style={{
                    fontSize: 24,
                  }}>
                  {listTextNumber}
                  {wordData.baseForm}
                  {contextNum > 1 && (
                    <Text style={{color: 'purple'}}>{` (${contextNum})`}</Text>
                  )}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: inBasket ? 'red' : 'green',
                  padding: 5,
                  marginVertical: 5,
                  borderRadius: 10,
                }}>
                <TouchableOpacity
                  onPress={() => addToConbinedWords(wordData, inBasket)}>
                  <Text>{inBasket ? 'Remove from 🗑️' : 'Add to 🗑️'}</Text>
                </TouchableOpacity>
              </View>

              {!isSelectedWord && (
                <SRSToggles
                  reviewData={wordData.reviewData}
                  id={wordId}
                  baseForm={baseForm}
                  limitedOptionsMode
                />
              )}
              {isSelectedWord && (
                <AnimatedWordModal
                  visible={wordData}
                  onClose={() => setSelectedWordState(null)}
                  deleteWord={handleDeleteWord}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};
export default SelectedTopicWordsSection;
