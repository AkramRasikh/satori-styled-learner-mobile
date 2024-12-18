import React, {useEffect, useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';

import AnimatedWordModal from './WordModal';
import SRSToggles from './SRSToggles';
import {PillButtonScaled} from './PillButton';
import {sortByDueDateWords} from '../utils/sort-by-due-date';
import useData from '../context/Data/useData';
import AnimatedModal from './AnimatedModal';

const CombineSentenceResponseModal = ({combineWordsListState}) => {
  return (
    <View
      style={{
        width: '100%',
        paddingBottom: 10,
      }}>
      {combineWordsListState?.map(item => {
        return (
          <View key={item.id} style={{display: 'flex', gap: 10}}>
            <Text style={{fontSize: 20}}>{item.targetLang}</Text>
            <Text style={{fontSize: 20}}>{item.baseLang}</Text>
          </View>
        );
      })}
    </View>
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

  const {combineWordsListState, loadingCombineSentences, combineWords} =
    useData();

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

  const handleCloseModal = () => {};

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
        <AnimatedModal visible onClose={handleCloseModal}>
          <CombineSentenceResponseModal
            combineWordsListState={combineWordsListState}
          />
        </AnimatedModal>
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
