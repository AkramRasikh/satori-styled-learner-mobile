import React, {useEffect} from 'react';
import {createContext, PropsWithChildren, useState} from 'react';
import useLanguageSelector from '../../../context/LanguageSelector/useLanguageSelector';
import {getFirebaseAudioURL} from '../../../hooks/useGetCombinedAudioData';
import useMP3File from '../../../hooks/useMP3File';
import useLoadAudioInstance from '../../../hooks/useLoadAudioInstance';
import {generateRandomId} from '../../../utils/generate-random-id';

export const DifficultSentenceAudioContext = createContext(null);

export const DifficultSentenceAudioProvider = ({
  soundRef,
  sentence,
  indexNum,
  nextAudioIsTheSameUrl,
  children,
}: PropsWithChildren<{}>) => {
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [miniSnippets, setMiniSnippets] = useState([]);
  const [isTriggered, setIsTriggered] = useState(false);
  const [isOnLoopState, setIsOnLoopState] = useState(false);
  const [isOnThreeSecondLoopState, setIsOnThreeSecondLoopState] = useState();
  const {languageSelectedState} = useLanguageSelector();

  const id = sentence.id;
  const topic = sentence.topic;
  const generalTopic = sentence.generalTopic;
  const isMediaContent = sentence.isMediaContent;

  const audioId = isMediaContent ? generalTopic : id;

  const soundDuration = soundRef?.current?._duration || 0;

  const url = getFirebaseAudioURL(audioId, languageSelectedState); // only allowing non number ending mp3 files

  const {loadFile, filePath} = useMP3File(audioId);
  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
    nextAudioIsTheSameUrl,
    setIsPlaying,
  });

  useEffect(() => {
    if (
      !isPlaying &&
      (isOnLoopState || Number.isFinite(isOnThreeSecondLoopState))
    ) {
      setIsOnLoopState(false);
      setIsOnThreeSecondLoopState(null);
      return;
    }

    if (Number.isFinite(isOnThreeSecondLoopState) && soundRef.current) {
      const startTime = isOnThreeSecondLoopState - 1.5;
      const endTime = isOnThreeSecondLoopState + 1.5;
      const beforeLoopTime1500 = currentTimeState < startTime;
      const beyondLoopTime1500 = endTime < currentTimeState;

      if (beforeLoopTime1500 || beyondLoopTime1500) {
        soundRef.current.getCurrentTime(() => {
          soundRef.current.setCurrentTime(startTime);
        });
      }
      return;
    }
    if (isOnLoopState && soundRef.current) {
      const beforeStartTime = currentTimeState < sentence.time;
      const beyondEndTime = sentence?.endTime < currentTimeState;
      if (beforeStartTime || beyondEndTime) {
        soundRef.current.getCurrentTime(() => {
          soundRef.current.setCurrentTime(sentence.time);
        });
      }
    }
  }, [
    sentence,
    isOnLoopState,
    currentTimeState,
    soundRef,
    isPlaying,
    isOnThreeSecondLoopState,
  ]);

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

  const handleLoad = () => {
    loadFile(audioId, url);
  };

  useEffect(() => {
    if (filePath && !isLoaded) {
      triggerLoadURL();
    }
  }, [filePath, triggerLoadURL, isLoaded]);

  const handleOnLoopSentence = () => {
    setIsOnLoopState(!isOnLoopState);
  };

  useEffect(() => {
    const isFirst2 = indexNum === 0 || indexNum === 1;
    if (!isLoaded && isFirst2 && !isTriggered) {
      setIsTriggered(true);
      loadFile(audioId, url);
    }
  }, [loadFile, isLoaded, indexNum, audioId, url, isTriggered]);

  const handleThreeSecondLoop = () => {
    if (Number.isFinite(isOnThreeSecondLoopState)) {
      setIsOnThreeSecondLoopState(null);
    } else {
      setIsOnThreeSecondLoopState(currentTimeState);
    }
  };

  const handleSnippet = () => {
    const snippetId = topic + '-' + generateRandomId();
    const itemToSave = {
      id: snippetId,
      sentenceId: id,
      pointInAudio: currentTimeState,
      isIsolated: true,
      url,
      topicName: topic,
    };
    setMiniSnippets(prev => [...prev, itemToSave]);
  };

  return (
    <DifficultSentenceAudioContext.Provider
      value={{
        handleLoad,
        handleSnippet,
        currentTimeState,
        isPlaying,
        setIsPlaying,
        isLoaded,
        soundDuration,
        soundRef,
        miniSnippets,
        setMiniSnippets,
        setCurrentTimeState,
        handleOnLoopSentence,
        isOnLoopState,
        handleThreeSecondLoop,
        isOnThreeSecondLoopState,
      }}>
      {children}
    </DifficultSentenceAudioContext.Provider>
  );
};
