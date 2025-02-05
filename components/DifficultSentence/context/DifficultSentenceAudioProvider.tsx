import React, {useEffect, useRef} from 'react';
import {createContext, PropsWithChildren, useState} from 'react';
import {useSelector} from 'react-redux';
import useLanguageSelector from '../../../context/LanguageSelector/useLanguageSelector';
import {getFirebaseAudioURL} from '../../../hooks/useGetCombinedAudioData';
import useMP3File from '../../../hooks/useMP3File';
import useLoadAudioInstance from '../../../hooks/useLoadAudioInstance';
import {generateRandomId} from '../../../utils/generate-random-id';

export const DifficultSentenceAudioContext = createContext(null);

export const DifficultSentenceAudioProvider = ({
  sentence,
  indexNum,
  children,
}: PropsWithChildren<{}>) => {
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [miniSnippets, setMiniSnippets] = useState([]);
  const [isTriggered, setIsTriggered] = useState(false);
  const {languageSelectedState} = useLanguageSelector();

  const targetLanguageSnippetsState = useSelector(state => state.snippets);

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

  useEffect(() => {
    setMiniSnippets(
      targetLanguageSnippetsState.filter(
        snippetData => snippetData.sentenceId === id,
      ),
    );
  }, []);

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

  useEffect(() => {
    const isFirst = indexNum === 0;
    if (!isLoaded && isFirst && !isTriggered) {
      setIsTriggered(true);
      loadFile(audioId, url);
    }
  }, [loadFile, isLoaded, indexNum, audioId, url, isTriggered]);

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
      }}>
      {children}
    </DifficultSentenceAudioContext.Provider>
  );
};
