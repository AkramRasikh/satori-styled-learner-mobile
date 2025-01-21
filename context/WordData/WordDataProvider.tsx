import React from 'react';
import {createContext, PropsWithChildren, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateWordAPI} from '../../api/update-word-data';
import {deleteWordAPI} from '../../api/delete-word';
import useLanguageSelector from '../LanguageSelector/useLanguageSelector';
import {FlashCardWordType} from '../../screens/WordStudy/types';
import {storeDataLocalStorage} from '../../helper-functions/local-storage-utils';
import {words} from '../../refs';
import {setWordsStateDispatch} from '../../store/wordSlice';

export const WordDataContext = createContext(null);

export const WordDataProvider = ({children}: PropsWithChildren<{}>) => {
  const [wordStudyState, setWordStudyState] = useState([]);
  const [dueCardsState, setDueCardsState] = useState([]);
  const [updatePromptState, setUpdatePromptState] = useState('');
  const [selectedTopicWords, setSelectedTopicWords] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedWordState, setSelectedWordState] = useState(null);
  const [tempNewStudyCardsState, setTempNewStudyCardsState] = useState<
    FlashCardWordType[]
  >([]);
  const dispatch = useDispatch();
  const {languageSelectedState: language} = useLanguageSelector();
  const dataStorageKeyPrefix = `${language}-data-`;

  const targetLanguageWordsState = useSelector(state => state.words);

  const updateWordData = async ({
    wordId,
    wordBaseForm,
    fieldToUpdate,
    isSnooze,
    isTempWord,
  }) => {
    try {
      const targetLanguageWordsStateUpdated = targetLanguageWordsState.map(
        item => {
          const thisWordId = item.id === wordId;
          if (thisWordId && isSnooze) {
            return {
              ...item,
              ...fieldToUpdate,
              reviewData: null,
            };
          }
          if (thisWordId) {
            return {
              ...item,
              ...fieldToUpdate,
            };
          }
          return item;
        },
      );
      if (isTempWord) {
        setTempNewStudyCardsState(prev =>
          prev.filter(wordData => wordData.id !== wordId),
        );
      }
      dispatch(setWordsStateDispatch(targetLanguageWordsStateUpdated));
      setUpdatePromptState(`${wordBaseForm} updated!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
      if (dueCardsState?.length > 0) {
        const wordStudyStateUpdated = wordStudyState.map(item => {
          const thisWordId = item.id === wordId;
          if (thisWordId && isSnooze) {
            return {
              ...item,
              ...fieldToUpdate,
              reviewData: null,
            };
          }
          if (thisWordId) {
            return {
              ...item,
              ...fieldToUpdate,
            };
          }
          return item;
        });
        setWordStudyState(wordStudyStateUpdated);
      }
      if (dueCardsState?.length > 0) {
        const updatedSelectedTopicWords = dueCardsState.filter(
          item => item.id !== wordId,
        );
        setDueCardsState(updatedSelectedTopicWords);
      }
      if (selectedTopicWords?.length > 0) {
        const updateSelectedTopicWords = selectedTopicWords.map(item => {
          const thisWordId = item.id === wordId;
          if (thisWordId && isSnooze) {
            return {
              ...item,
              ...fieldToUpdate,
              reviewData: null,
            };
          }
          if (thisWordId) {
            return {
              ...item,
              ...fieldToUpdate,
            };
          }
          return item;
        });
        setSelectedTopicWords(updateSelectedTopicWords);
      }

      await updateWordAPI({
        wordId,
        fieldToUpdate,
        language,
      });
      await storeDataLocalStorage(
        dataStorageKeyPrefix + words,
        targetLanguageWordsStateUpdated,
      );
      return true;
    } catch (error) {
      console.log('## updateWordData', {error});
    }
  };

  const deleteWord = async ({wordId, wordBaseForm, isTempWord}) => {
    try {
      const targetLanguageWordsStateUpdated = targetLanguageWordsState.filter(
        item => item.id !== wordId,
      );
      dispatch(setWordsStateDispatch(targetLanguageWordsStateUpdated));
      await storeDataLocalStorage(
        dataStorageKeyPrefix + words,
        targetLanguageWordsStateUpdated,
      );

      setUpdatePromptState(`${wordBaseForm} deleted!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
      if (isTempWord) {
        setTempNewStudyCardsState(prev =>
          prev.filter(wordData => wordData.id !== wordId),
        );
      }
      await deleteWordAPI({wordId, language});
    } catch (error) {
      setUpdatePromptState(`Error deleting ${wordBaseForm} 😟!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
      console.log('## deleteWord', {error});
    }
  };

  return (
    <WordDataContext.Provider
      value={{
        updateWordData,
        deleteWord,
        updatePromptState,
        wordStudyState,
        setWordStudyState,
        dueCardsState,
        setDueCardsState,
        selectedTopicWords,
        setSelectedTopicWords,
        selectedTopic,
        setSelectedTopic,
        selectedWordState,
        setSelectedWordState,
        tempNewStudyCardsState,
        setTempNewStudyCardsState,
      }}>
      {children}
    </WordDataContext.Provider>
  );
};
