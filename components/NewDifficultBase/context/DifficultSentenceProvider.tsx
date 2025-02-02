import React, {useEffect, useRef} from 'react';
import {createContext, PropsWithChildren, useState} from 'react';
import useLanguageSelector from '../../../context/LanguageSelector/useLanguageSelector';
import {getFirebaseAudioURL} from '../../../hooks/useGetCombinedAudioData';
import useMP3File from '../../../hooks/useMP3File';
import useLoadAudioInstance from '../../../hooks/useLoadAudioInstance';
import {generateRandomId} from '../../../utils/generate-random-id';
import {
  getCardDataRelativeToNow,
  getDueDate,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../../srs-algo';
import Clipboard from '@react-native-clipboard/clipboard';

export const DifficultSentenceContext = createContext(null);

export const DifficultSentenceProvider = ({
  updateSentenceData,
  sentence,
  indexNum,
  children,
}: PropsWithChildren<{}>) => {
  const [updatingSentenceState, setUpdatingSentenceState] = useState('');
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [miniSnippets, setMiniSnippets] = useState([]);

  const {languageSelectedState} = useLanguageSelector();

  const id = sentence.id;
  const topic = sentence.topic;
  const isMediaContent = sentence.isMediaContent;

  const audioId = isMediaContent ? topic : id;
  const soundRef = useRef();

  const soundDuration = soundRef?.current?._duration || 0;

  const url = getFirebaseAudioURL(audioId, languageSelectedState);

  const {loadFile, filePath} = useMP3File(audioId);
  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
  });

  const timeNow = new Date();

  const reviewData = sentence?.reviewData;
  const isAdhoc = sentence?.isAdhoc;

  const hasDueDate = getDueDate(reviewData);

  const nextReview = sentence?.nextReview;
  const reviewHistory = sentence?.reviewHistory;

  const hasLegacyReviewSystem = !reviewData?.due && nextReview;

  const cardDataRelativeToNow = getCardDataRelativeToNow({
    hasDueDate,
    reviewData,
    nextReview,
    reviewHistory,
  });

  useEffect(() => {
    const getCurrentTimeFunc = () => {
      soundRef.current.getCurrentTime(currentTime => {
        setCurrentTimeState(currentTime);
      });
    };
    const interval = setInterval(() => {
      if (soundRef.current?.isPlaying()) {
        getCurrentTimeFunc();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [soundRef, setCurrentTimeState]);

  const getShouldRemoveLegacyFields = () => {
    if (hasLegacyReviewSystem) {
      return {
        nextReview: null,
        reviewHistory: null,
      };
    }
    return {};
  };

  const handleNextReview = async difficulty => {
    const nextScheduledOptions = getNextScheduledOptions({
      card: cardDataRelativeToNow,
      contentType: srsRetentionKeyTypes.sentences,
    });
    const nextReviewData = nextScheduledOptions[difficulty].card;
    const hasBeenUpdated = await updateSentenceData({
      isAdhoc,
      topicName: sentence.topic,
      sentenceId: sentence.id,
      fieldToUpdate: {
        reviewData: nextReviewData,
        ...getShouldRemoveLegacyFields(),
      },
      contentIndex: sentence.contentIndex,
    });
    console.log('## handleNextReview', {hasBeenUpdated});
  };

  const handleLoad = () => {
    loadFile(audioId, url);
  };

  useEffect(() => {
    if (filePath && !isLoaded) {
      triggerLoadURL();
    }
  }, [filePath, triggerLoadURL, isLoaded]);

  useEffect(() => {
    const isFirst = indexNum === 0;
    if (!isLoaded && isFirst) {
      loadFile(audioId, url);
    }
  }, [loadFile, isLoaded, indexNum, audioId, url]);

  const handleSnippet = currentTime => {
    const snippetId = topic + '-' + generateRandomId();
    const itemToSave = {
      id: snippetId,
      sentenceId: id,
      pointInAudio: currentTime,
      isIsolated: true,
      url,
      topicName: topic,
    };
    setMiniSnippets(prev => [...prev, itemToSave]);
  };

  const handleCopyText = () => {
    Clipboard.setString(sentence.targetLang);
  };

  return (
    <DifficultSentenceContext.Provider
      value={{
        updatingSentenceState,
        setUpdatingSentenceState,
        handleLoad,
        handleSnippet,
        handleNextReview,
        currentTimeState,
        setCurrentTimeState,
        isPlaying,
        setIsPlaying,
        isLoaded,
        soundDuration,
        soundRef,
        handleCopyText,
      }}>
      {children}
    </DifficultSentenceContext.Provider>
  );
};
