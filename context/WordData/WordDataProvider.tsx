import React from 'react';
import {createContext, PropsWithChildren, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateWordAPI} from '../../api/update-word-data';
import {deleteWordAPI} from '../../api/delete-word';
import useLanguageSelector from '../LanguageSelector/useLanguageSelector';
import {storeDataLocalStorage} from '../../helper-functions/local-storage-utils';
import {words} from '../../refs';
import {setWordsStateDispatch} from '../../store/wordSlice';
import useData from '../Data/useData';

export const WordDataContext = createContext(null);

export const WordDataProvider = ({children}: PropsWithChildren<{}>) => {
  const [wordStudyState, setWordStudyState] = useState([]);
  const [combineWordsListState, setCombineWordsListState] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const dispatch = useDispatch();
  const {languageSelectedState: language} = useLanguageSelector();
  const dataStorageKeyPrefix = `${language}-data-`;

  const {setUpdatePromptState, updatePromptState} = useData();

  const targetLanguageWordsState = useSelector(state => state.words);

  const updateWordData = async ({wordId, wordBaseForm, fieldToUpdate}) => {
    try {
      const targetLanguageWordsStateUpdated = targetLanguageWordsState.map(
        item => {
          const thisWordId = item.id === wordId;
          if (thisWordId) {
            return {
              ...item,
              ...fieldToUpdate,
            };
          }
          return item;
        },
      );
      dispatch(setWordsStateDispatch(targetLanguageWordsStateUpdated));
      setUpdatePromptState(`${wordBaseForm} updated!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
      const wordStudyStateUpdated = wordStudyState.map(item => {
        const thisWordId = item.id === wordId;
        if (thisWordId) {
          return {
            ...item,
            ...fieldToUpdate,
          };
        }
        return item;
      });
      setWordStudyState(wordStudyStateUpdated);
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
      console.log('## updateWordData WordProvider', {error});
    }
  };

  const deleteWord = async ({wordId, wordBaseForm}) => {
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
        selectedTopic,
        setSelectedTopic,
        combineWordsListState,
        setCombineWordsListState,
      }}>
      {children}
    </WordDataContext.Provider>
  );
};
