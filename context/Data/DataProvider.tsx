import React from 'react';
import {createContext, PropsWithChildren, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllData} from '../../api/load-content';
import {updateSentenceDataAPI} from '../../api/update-sentence-data';
import updateAdhocSentenceAPI from '../../api/update-adhoc-sentence';
import {addSnippetAPI, deleteSnippetAPI} from '../../api/snippet';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import saveWordAPI from '../../api/save-word';
import useLanguageSelector from '../LanguageSelector/useLanguageSelector';
import {adhocSentences, content, snippets, words} from '../../refs';
import {storeDataLocalStorage} from '../../helper-functions/local-storage-utils';
import {updateCreateReviewHistory} from '../../api/update-create-review-history';
import {sentenceReviewBulkAPI} from '../../api/sentence-review-bulk';
import {combineWordsAPI} from '../../api/combine-words';
import {addSentenceContextAPI} from '../../api/add-sentence-context';
import {addSentenceAudioAPI} from '../../api/add-sentence-audio';
import {
  setLearningContentStateDispatch,
  updateSentenceAndReturnState,
  updateSentenceRemoveReviewAndReturnState,
} from '../../store/contentSlice';
import {setWordsStateDispatch} from '../../store/wordSlice';
import {
  setSentencesStateDispatch,
  updateAdhocSentenceAndReturnState,
  updateAdhocSentenceRemoveReviewAndReturnState,
} from '../../store/sentencesSlice';
import {setSnippetsStateDispatch} from '../../store/snippetsSlice';
import {deleteWordAPI} from '../../api/delete-word';
import {updateWordAPI} from '../../api/update-word-data';
import {breakdownSentenceAPI} from '../../api/breakdown-sentence';
import {
  getEmptyCard,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../srs-algo';
import addAdhocSentenceTTSAPI from '../../api/add-adhoc-sentence-tts';
import addAdhocGrammarTTSAPI from '../../api/add-adhoc-grammar-tts';
import {addAdhocWordMinimalPairAPI} from '../../api/add-adhoc-word-minimal-pair';
import {breakdownAllSentencesAPI} from '../../api/breakdown-all-sentences';
import {sentenceReviewBulkAllAPI} from '../../api/remove-all-content-review';
import addCustomWordPromptAPI from '../../api/add-custom-word-prompt';

export const DataContext = createContext(null);

export const DataProvider = ({children}: PropsWithChildren<{}>) => {
  const [updatingSentenceState, setUpdatingSentenceState] = useState('');
  const [dataProviderIsLoading, setDataProviderIsLoading] = useState(true);
  const [provdiderError, setProvdiderError] = useState(null);
  const [updatePromptState, setUpdatePromptState] = useState('');
  const [combineWordsListState, setCombineWordsListState] = useState([]);
  const [updateMetaDataState, setUpdateMetaDataState] = useState(0);
  const adhocTargetLanguageSentencesState = useSelector(
    state => state.sentences,
  );
  const targetLanguageSnippetsState = useSelector(state => state.snippets);
  const targetLanguageWordsState = useSelector(state => state.words);
  const targetLanguageLoadedContentMasterState = useSelector(
    state => state.learningContent,
  );
  const dispatch = useDispatch();

  const {languageSelectedState: language} = useLanguageSelector();
  const dataStorageKeyPrefix = `${language}-data-`;

  const wordsFromSentences = [];
  const getPureWords = () => {
    let pureWords = [];

    targetLanguageWordsState?.forEach(wordData => {
      if (wordData?.baseForm) {
        pureWords.push(wordData.baseForm);
      }
      if (wordData?.surfaceForm) {
        pureWords.push(wordData.surfaceForm);
      }
    });

    adhocTargetLanguageSentencesState?.forEach(sentence => {
      if (sentence?.matchedWordsSurface) {
        sentence?.matchedWordsSurface.forEach((item, index) => {
          if (item && !pureWords.includes(item)) {
            pureWords.push(item);
            wordsFromSentences.push({
              wordId: sentence?.matchedWordsId[index],
              word: item,
            });
          }
        });
      }
    });
    const pureWordsUnique =
      pureWords?.length > 0 ? makeArrayUnique(pureWords) : [];
    return pureWordsUnique;
  };

  const pureWordsArr = getPureWords();

  const updateLoadedContentStateAfterSentenceUpdate = ({
    sentenceId,
    resObj,
    contentIndex,
  }) => {
    const updatedState = [...targetLanguageLoadedContentMasterState];
    const thisTopicData = updatedState[contentIndex];

    const updatedContent = thisTopicData.content.map(sentenceData => {
      if (sentenceData.id === sentenceId) {
        return {
          ...sentenceData,
          ...resObj,
        };
      }
      return sentenceData;
    });

    updatedState[contentIndex] = {
      ...thisTopicData,
      content: updatedContent,
    };

    dispatch(setLearningContentStateDispatch(updatedState));
    return updatedState;
  };

  const updateAllLoadedContentStateAfterSentenceUpdate = ({
    resObjArr,
    contentIndex,
  }) => {
    // Look at how its reflected in the content section
    const updatedState = [...targetLanguageLoadedContentMasterState];
    const thisTopicData = updatedState[contentIndex];

    const updatedContent = thisTopicData.content.map(sentenceData => {
      const thisItemInResObj = resObjArr.find(i => i.id === sentenceData.id);
      if (thisItemInResObj) {
        return {
          ...sentenceData,
          ...thisItemInResObj,
        };
      }
      return sentenceData;
    });

    updatedState[contentIndex] = {
      ...thisTopicData,
      content: updatedContent,
    };

    dispatch(setLearningContentStateDispatch(updatedState));
    return updatedState;
  };

  const updatePromptFunc = promptText => {
    setUpdatePromptState(promptText);
  };

  const updateContentMetaData = async ({
    topicName,
    fieldToUpdate,
    contentIndex,
  }) => {
    try {
      const resObj = await updateCreateReviewHistory({
        title: topicName,
        fieldToUpdate,
        language,
      });
      if (resObj) {
        const updatedState = [...targetLanguageLoadedContentMasterState];
        const thisTopicData = updatedState[contentIndex];
        const newTopicState = {...thisTopicData, ...resObj};
        updatedState[contentIndex] = {
          ...newTopicState,
        };
        dispatch(setLearningContentStateDispatch(updatedState));
        setUpdateMetaDataState(prev => prev + 1);
        await storeDataLocalStorage(
          dataStorageKeyPrefix + content,
          updatedState,
        );
        updatePromptFunc(`${topicName} updated!`);
        return newTopicState;
      }
    } catch (error) {
      updatePromptFunc(`Error updating ${topicName}!`);
    }
  };

  const addAdhocSentences = async params => {
    try {
      const adhocSentencesRes = await addAdhocSentenceTTSAPI(params);
      const updatedAdhocSentencesState = [
        ...adhocTargetLanguageSentencesState,
        ...adhocSentencesRes,
      ];
      dispatch(setSentencesStateDispatch(updatedAdhocSentencesState));
      updatePromptFunc(`Added ${adhocSentencesRes.length} sentences!`);
      await storeDataLocalStorage(
        dataStorageKeyPrefix + adhocSentences,
        updatedAdhocSentencesState,
      ); // saving to adhoc or sentences?
    } catch (error) {
      updatePromptFunc('Error creating adhoc sentences words');
    }
  };

  const addAdhocGrammar = async params => {
    try {
      const adhocSentencesRes = await addAdhocGrammarTTSAPI(params);
      const updatedAdhocSentencesState = [
        ...adhocTargetLanguageSentencesState,
        ...adhocSentencesRes,
      ];
      dispatch(setSentencesStateDispatch(updatedAdhocSentencesState));
      updatePromptFunc(`Added ${adhocSentencesRes.length} sentences!`);
      await storeDataLocalStorage(
        dataStorageKeyPrefix + adhocSentences,
        updatedAdhocSentencesState,
      ); // saving to adhoc or sentences?
    } catch (error) {
      updatePromptFunc('Error creating adhoc grammar sentences');
    }
  };

  const combineWords = async ({inputWords, myCombinedSentence}) => {
    try {
      const combineWordsSentencesRes = await combineWordsAPI({
        inputWords,
        language,
        myCombinedSentence,
      });
      const updatedAdhocSentencesState = [
        ...adhocTargetLanguageSentencesState,
        ...combineWordsSentencesRes,
      ];
      dispatch(setSentencesStateDispatch(updatedAdhocSentencesState));
      const wordsForBanner = inputWords.map((item, index) => {
        const word = item.word;
        if (index === inputWords.length) {
          return word;
        }
        return `${word}, `;
      });
      updatePromptFunc(
        `Added ${wordsForBanner.join('')} in ${
          combineWordsSentencesRes.length
        } sentences!`,
      );
      await storeDataLocalStorage(
        dataStorageKeyPrefix + adhocSentences,
        updatedAdhocSentencesState,
      ); // saving to adhoc or sentences?
      return combineWordsSentencesRes.map(item => ({
        ...item,
        isSentenceHelper: true,
        isAdhoc: true,
        generalTopic: 'sentence-helper',
      }));
    } catch (error) {
      updatePromptFunc('Error combining words');
    } finally {
    }
  };

  const sentenceReviewBulk = async ({
    fieldToUpdate,
    topicName,
    contentIndex,
    removeReview,
  }) => {
    try {
      const updatedContentRes = await sentenceReviewBulkAPI({
        title: topicName,
        fieldToUpdate,
        language,
        removeReview,
      });

      if (updatedContentRes) {
        const updatedState = [...targetLanguageLoadedContentMasterState];
        const thisTopicData = updatedState[contentIndex];
        const newTopicState = {...thisTopicData, ...updatedContentRes};
        updatedState[contentIndex] = {
          ...newTopicState,
        };
        dispatch(setLearningContentStateDispatch(updatedState));
        await storeDataLocalStorage(
          dataStorageKeyPrefix + content,
          updatedState,
        );
        updatePromptFunc(`${topicName} updated!`);
        return newTopicState;
      }
    } catch (error) {
      updatePromptFunc(`Error updating ${topicName}!`);
    }
  };

  const sentenceReviewBulkAll = async ({
    topics,
    generalTopic,
    contentIndexArr,
  }) => {
    try {
      const updatedContentResArr = await sentenceReviewBulkAllAPI({
        topics,
        language,
      });

      if (updatedContentResArr) {
        const updatedState = [...targetLanguageLoadedContentMasterState];
        contentIndexArr.forEach(async (contentIndex, index) => {
          const isLast = contentIndexArr.length === index + 1;
          const thisTopicData = updatedState[contentIndex];
          if (!updatedContentResArr.includes(thisTopicData.title)) {
            console.log('## bulk not aligned with BE');
            return;
          }

          updatedState[contentIndex] = {
            ...thisTopicData,
            content: thisTopicData.content.map(sentenceWidget => {
              if (sentenceWidget?.reviewData) {
                const {reviewData, ...rest} = sentenceWidget;
                return {
                  ...rest,
                };
              }
              return sentenceWidget;
            }),
          };
          if (isLast) {
            dispatch(setLearningContentStateDispatch(updatedState));
            await storeDataLocalStorage(
              dataStorageKeyPrefix + content,
              updatedState,
            );
            updatePromptFunc(`${generalTopic} updated!`);
          }
        });
        return true;
      }
    } catch (error) {
      updatePromptFunc(`Error updating ${generalTopic}!`);
    }
  };

  const handleUpdateAdhocSentenceDifficult = async ({
    sentenceId,
    fieldToUpdate,
  }) => {
    try {
      const res = await updateAdhocSentenceAPI({
        sentenceId,
        fieldToUpdate,
        language,
      });
      return {
        isAdhoc: true,
        ...res,
      };
    } catch (error) {
      updatePromptFunc('Error saving updating adhoc sentence');
    }
  };

  const breakdownSentence = async ({
    topicName,
    sentenceId,
    language,
    targetLang,
    contentIndex,
  }) => {
    try {
      setUpdatingSentenceState(sentenceId);
      const resObj = await breakdownSentenceAPI({
        topicName,
        sentenceId,
        targetLang,
        language,
      });

      const updatedContentState = updateLoadedContentStateAfterSentenceUpdate({
        sentenceId,
        resObj,
        contentIndex,
      });
      await storeDataLocalStorage(
        dataStorageKeyPrefix + content,
        updatedContentState,
      );

      updatePromptFunc(`${topicName} updated!`);
      return updatedContentState[contentIndex];
    } catch (error) {
      console.log('## breakdownSentence', {error});
      updatePromptFunc(`Error updating sentence for ${topicName}`);
    } finally {
      setUpdatingSentenceState('');
    }
  };
  const breakdownAllSentences = async ({
    topicName,
    sentences,
    contentIndex,
  }) => {
    try {
      const resObjArr = await breakdownAllSentencesAPI({
        topicName,
        sentences,
        language,
      });

      const updatedContentState =
        updateAllLoadedContentStateAfterSentenceUpdate({
          resObjArr,
          contentIndex,
        });
      await storeDataLocalStorage(
        dataStorageKeyPrefix + content,
        updatedContentState,
      );

      updatePromptFunc(`${topicName} updated!`);
      return updatedContentState[contentIndex];
    } catch (error) {
      console.log('## breakdownAllSentences', {error});
      updatePromptFunc(`Error updating sentence for ${topicName}`);
    }
  };

  const updateSentenceData = async ({
    topicName,
    sentenceId,
    fieldToUpdate,
    isAdhoc,
    contentIndex,
    isRemoveReview,
  }) => {
    try {
      setUpdatingSentenceState(sentenceId);
      const updatedFieldFromDB = isAdhoc
        ? await handleUpdateAdhocSentenceDifficult({
            sentenceId,
            fieldToUpdate,
          })
        : await updateSentenceDataAPI({
            topicName,
            sentenceId,
            fieldToUpdate,
            language,
          });

      if (!isAdhoc) {
        if (isRemoveReview) {
          const updatedContentState = dispatch(
            updateSentenceRemoveReviewAndReturnState({
              sentenceId,
              contentIndex,
            }),
          ).learningContent;

          await storeDataLocalStorage(
            dataStorageKeyPrefix + content,
            updatedContentState,
          );
        } else {
          const updatedContentState = dispatch(
            updateSentenceAndReturnState({
              sentenceId,
              fieldToUpdate: updatedFieldFromDB,
              contentIndex,
            }),
          ).learningContent;

          await storeDataLocalStorage(
            dataStorageKeyPrefix + content,
            updatedContentState,
          );
        }
      } else {
        if (isRemoveReview) {
          const updatedSentencesState = dispatch(
            updateAdhocSentenceRemoveReviewAndReturnState({
              sentenceId,
            }),
          ).sentences;

          await storeDataLocalStorage(
            dataStorageKeyPrefix + adhocSentences,
            updatedSentencesState,
          );
        } else {
          const updatedSentencesState = dispatch(
            updateAdhocSentenceAndReturnState({
              sentenceId,
              fieldToUpdate: updatedFieldFromDB,
            }),
          ).sentences;

          await storeDataLocalStorage(
            dataStorageKeyPrefix + adhocSentences,
            updatedSentencesState,
          );
        }
      }
      updatePromptFunc(`${topicName} updated!`);
      return updatedFieldFromDB;
    } catch (error) {
      console.log('## updateSentenceData', {error});
      updatePromptFunc(`Error updating sentence for ${topicName}`);
    } finally {
      setUpdatingSentenceState('');
    }
  };

  const getSentenceAudio = async ({id, sentence}) => {
    try {
      const res = await addSentenceAudioAPI({language, id, sentence});
      return res;
    } catch (error) {
      updatePromptFunc(`Error getting audio for  ${sentence}`);
    }
  };

  const addSentenceContext = async contextData => {
    try {
      const contextWordsAddedResponse = await addSentenceContextAPI({
        language,
        ...contextData,
      });
      const contextIds = contextWordsAddedResponse.map(item => item.id);
      return contextIds;
    } catch (error) {
      updatePromptFunc('Error adding context data');
    }
  };

  const bulkAddReviews = async ({topicName, sentencesArray, contentIndex}) => {
    const res = await Promise.all(
      // currently returning content for each arr
      sentencesArray.map(
        async sentenceData =>
          await updateSentenceViaContent({
            topicName,
            sentenceId: sentenceData.id,
            fieldToUpdate: sentenceData.fieldToUpdate,
            contentIndex,
          }),
      ),
    );

    return res;
  };

  const updateSentenceViaContent = async ({
    topicName,
    sentenceId,
    fieldToUpdate,
    contentIndex,
  }) => {
    try {
      setUpdatingSentenceState(sentenceId);
      const resObj = await updateSentenceDataAPI({
        topicName,
        sentenceId,
        fieldToUpdate,
        language,
      });
      const updatedContentState = updateLoadedContentStateAfterSentenceUpdate({
        sentenceId,
        resObj,
        contentIndex,
      });
      await storeDataLocalStorage(
        dataStorageKeyPrefix + content,
        updatedContentState,
      );
      updatePromptFunc(`${topicName} updated!`);
      return updatedContentState[contentIndex];
    } catch (error) {
      console.log('## updateSentenceViaContent', {error});
      updatePromptFunc(`Error updating sentence for ${topicName}`);
    } finally {
      setUpdatingSentenceState('');
    }
  };

  const addSnippet = async snippetData => {
    try {
      const snippetDataFromAPI = await addSnippetAPI({
        contentEntry: snippetData,
        language,
      });

      const updatedSnippets = [
        ...targetLanguageSnippetsState,
        {...snippetDataFromAPI, saved: true},
      ];
      dispatch(setSnippetsStateDispatch(updatedSnippets));
      await storeDataLocalStorage(
        dataStorageKeyPrefix + snippets,
        updatedSnippets,
      );
      return snippetDataFromAPI;
    } catch (error) {
      updatePromptFunc('❌☠️ Error adding snippet');
    }
  };

  const updateWordData = async ({wordId, wordBaseForm, fieldToUpdate}) => {
    try {
      const updatedWordProperties = await updateWordAPI({
        wordId,
        fieldToUpdate,
        language,
      });

      const targetLanguageWordsStateUpdated = targetLanguageWordsState.map(
        item => {
          const thisWordId = item.id === wordId;
          if (thisWordId) {
            return {
              ...item,
              ...updatedWordProperties,
            };
          }
          return item;
        },
      );
      dispatch(setWordsStateDispatch(targetLanguageWordsStateUpdated));
      await storeDataLocalStorage(
        dataStorageKeyPrefix + words,
        targetLanguageWordsStateUpdated,
      );
      setUpdatePromptState(`${wordBaseForm} updated!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
      return true;
    } catch (error) {
      console.log('## updateWordData DataProvider', {error});
    }
  };

  const deleteWord = async ({wordId, wordBaseForm}) => {
    try {
      await deleteWordAPI({wordId, language});
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
    } catch (error) {
      setUpdatePromptState(`Error deleting ${wordBaseForm} 😟!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
      console.log('## deleteWord', {error});
    }
  };

  const removeSnippet = async ({snippetId}) => {
    try {
      const deletedSnippetId = await deleteSnippetAPI({snippetId, language});
      const updatedSnippets = targetLanguageSnippetsState.filter(
        item => item.id !== deletedSnippetId,
      );
      dispatch(setSnippetsStateDispatch(updatedSnippets));
      await storeDataLocalStorage(
        dataStorageKeyPrefix + snippets,
        updatedSnippets,
      );
      return deletedSnippetId;
    } catch (error) {
      console.log('## error removeSnippet (DataProvider.tsx)');
      updatePromptFunc('Error removing snippet');
    }
  };

  const saveWordFirebase = async ({
    highlightedWord,
    highlightedWordSentenceId,
    contextSentence,
    isGoogle,
    meaning,
  }) => {
    try {
      const cardDataRelativeToNow = getEmptyCard();
      const nextScheduledOptions = getNextScheduledOptions({
        card: cardDataRelativeToNow,
        contentType: srsRetentionKeyTypes.vocab,
      });

      const savedWord = await saveWordAPI({
        highlightedWord,
        highlightedWordSentenceId,
        contextSentence,
        isGoogle,
        language,
        reviewData: nextScheduledOptions['1'].card,
        meaning,
      });
      const newWordsState = [...targetLanguageWordsState, savedWord];
      dispatch(setWordsStateDispatch(newWordsState));
      await storeDataLocalStorage(dataStorageKeyPrefix + words, newWordsState);
      return savedWord;
    } catch (error) {
      console.log('## saveWordFirebase Provider err', error);
      updatePromptFunc(`Error saving ${highlightedWord}`);
    }
  };

  const getThisSentencesWordList = sentence => {
    let matchedWordsData = [];
    targetLanguageWordsState.forEach(word => {
      if (!word) {
        // quick fix
        return;
      }
      const baseForm = word.baseForm;
      const surfaceForm = word.surfaceForm;
      if (sentence.includes(baseForm)) {
        const indexOfBaseForm = sentence.indexOf(baseForm);
        matchedWordsData.push({
          ...word,
          indexStart: indexOfBaseForm,
          indexEnd: indexOfBaseForm + baseForm.length,
        });

        return;
      }

      if (sentence.includes(surfaceForm)) {
        const indexOfSurfaceForm = sentence.indexOf(surfaceForm);

        matchedWordsData.push({
          ...word,
          indexStart: indexOfSurfaceForm,
          indexEnd: indexOfSurfaceForm + surfaceForm.length,
        });
        return;
      }
    });

    wordsFromSentences.forEach(item => {
      const isAlreadyInSentence = matchedWordsData.some(
        matchedWord =>
          item.word === matchedWord.baseForm ||
          item.word === matchedWord.surfaceForm,
      );

      if (sentence.includes(item.word) && !isAlreadyInSentence) {
        const thisWordsData = targetLanguageWordsState.find(
          word => item.wordId === word.id,
        );

        if (thisWordsData) {
          const indexOfSurfaceForm = sentence.indexOf(item.word);
          matchedWordsData.push({
            ...thisWordsData,
            baseForm: item.word,
            indexStart: indexOfSurfaceForm,
            indexEnd: indexOfSurfaceForm + item.word.length,
          });
        }
      }
    });

    return matchedWordsData;
  };

  const handleAdhocMinimalPair = async ({inputWord, mode}) => {
    try {
      const adhocMinimalPairingRes = await addAdhocWordMinimalPairAPI({
        inputWord,
        language,
        isMeaning: mode,
      });
      const updatedAdhocSentencesState = [
        ...adhocTargetLanguageSentencesState,
        ...adhocMinimalPairingRes,
      ];
      dispatch(setSentencesStateDispatch(updatedAdhocSentencesState));
      updatePromptFunc(
        `Added ${inputWord.word} in ${adhocMinimalPairingRes.length} sentences!`,
      );
      await storeDataLocalStorage(
        dataStorageKeyPrefix + adhocSentences,
        updatedAdhocSentencesState,
      ); // saving to adhoc or sentences?
      return adhocMinimalPairingRes.map(item => ({
        ...item,
        isSentenceHelper: true,
        isAdhoc: true,
        generalTopic: 'sentence-helper',
      }));
    } catch (error) {
      updatePromptFunc('Error creating adhoc mininmal pairing words');
    } finally {
    }
  };

  const handleAddCustomWordPrompt = async ({inputWord, prompt}) => {
    console.log('## Data Provider: ', prompt);

    try {
      const adhocMinimalPairingRes = await addCustomWordPromptAPI({
        inputWord,
        language,
        prompt,
      });
      const updatedAdhocSentencesState = [
        ...adhocTargetLanguageSentencesState,
        ...adhocMinimalPairingRes,
      ];
      dispatch(setSentencesStateDispatch(updatedAdhocSentencesState));
      updatePromptFunc(
        `Added ${inputWord.word} in ${adhocMinimalPairingRes.length} sentences!`,
      );
      await storeDataLocalStorage(
        dataStorageKeyPrefix + adhocSentences,
        updatedAdhocSentencesState,
      ); // saving to adhoc or sentences?
      return adhocMinimalPairingRes.map(item => ({
        ...item,
        isSentenceHelper: true,
        isAdhoc: true,
        generalTopic: 'sentence-helper',
      }));
    } catch (error) {
      updatePromptFunc('Error creating adhoc mininmal pairing words');
    } finally {
    }
  };

  const fetchData = async selectedLanguage => {
    try {
      const allStudyDataRes = await getAllData({
        language: selectedLanguage,
        freshData: false,
      });
      const targetLanguageLoadedSentences = allStudyDataRes.sentences;
      const targetLanguageLoadedContent = allStudyDataRes.content;
      const targetLanguageLoadedSnippets = allStudyDataRes.snippets;
      const targetLanguageLoadedWords = allStudyDataRes.words;
      const targetLanguageLoadedSnippetsWithSavedTag =
        targetLanguageLoadedSnippets?.map(item => ({
          ...item,
          saved: true,
        }));
      dispatch(
        setSnippetsStateDispatch(targetLanguageLoadedSnippetsWithSavedTag),
      );
      const sortedContent = targetLanguageLoadedContent
        ?.sort((a, b) => {
          return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
        })
        .map((contentWidget, contentIndex) => ({
          ...contentWidget,
          contentIndex: contentIndex,
        }));
      dispatch(setLearningContentStateDispatch(sortedContent));
      dispatch(setWordsStateDispatch(targetLanguageLoadedWords));
      dispatch(setSentencesStateDispatch(targetLanguageLoadedSentences));
    } catch (error) {
      console.log('## DataProvider error: ', error);
      setProvdiderError(error);
    } finally {
      setDataProviderIsLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        dataProviderIsLoading,
        provdiderError,
        updateSentenceData,
        addSnippet,
        removeSnippet,
        pureWords: pureWordsArr,
        saveWordFirebase,
        getThisSentencesWordList,
        updatingSentenceState,
        updateContentMetaData,
        updateSentenceViaContent,
        bulkAddReviews,
        sentenceReviewBulk,
        combineWordsListState,
        combineWords,
        setCombineWordsListState,
        addSentenceContext,
        getSentenceAudio,
        deleteWord,
        updateWordData,
        updateMetaDataState,
        breakdownSentence,
        fetchData,
        setUpdatePromptState,
        updatePromptState,
        addAdhocSentences,
        addAdhocGrammar,
        handleAdhocMinimalPair,
        breakdownAllSentences,
        sentenceReviewBulkAll,
        handleAddCustomWordPrompt,
      }}>
      {children}
    </DataContext.Provider>
  );
};
