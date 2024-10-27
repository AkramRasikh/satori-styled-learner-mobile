import React from 'react';
import {createContext, PropsWithChildren, useState} from 'react';
import {updateWordAPI} from '../../api/update-word-data';
import {deleteWordAPI} from '../../api/delete-word';
import useLanguageSelector from './useLanguageSelector';

export const WordDataContext = createContext(null);

export const WordDataProvider = ({children}: PropsWithChildren<{}>) => {
  const [japaneseWordsState, setJapaneseWordsState] = useState([]);
  const [wordStudyState, setWordStudyState] = useState([]);
  const [dueCardsState, setDueCardsState] = useState([]);
  const [updatePromptState, setUpdatePromptState] = useState('');
  const [selectedTopicWords, setSelectedTopicWords] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedWordState, setSelectedWordState] = useState(null);
  const {languageSelectedState: language} = useLanguageSelector();

  const updateWordData = async ({
    wordId,
    wordBaseForm,
    fieldToUpdate,
    isSnooze,
  }) => {
    try {
      const updatedWordProperties = await updateWordAPI({
        wordId,
        fieldToUpdate,
        language,
      });
      const japaneseWordsStateUpdated = japaneseWordsState.map(item => {
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
            ...updatedWordProperties,
          };
        }
        return item;
      });
      setJapaneseWordsState(japaneseWordsStateUpdated);
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
              ...updatedWordProperties,
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
        setTimeout(() => setDueCardsState(updatedSelectedTopicWords), 1000);
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
              ...updatedWordProperties,
            };
          }
          return item;
        });
        setSelectedTopicWords(updateSelectedTopicWords);
      }

      return true;
    } catch (error) {
      console.log('## updateWordData', {error});
    }
  };

  const deleteWord = async ({wordId, wordBaseForm}) => {
    try {
      await deleteWordAPI({wordId, language});
      const japaneseWordsStateUpdated = japaneseWordsState.filter(
        item => item.id !== wordId,
      );
      setJapaneseWordsState(japaneseWordsStateUpdated);
      setUpdatePromptState(`${wordBaseForm} deleted!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
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
      }}>
      {children}
    </WordDataContext.Provider>
  );
};
