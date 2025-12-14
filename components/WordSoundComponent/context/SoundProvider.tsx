import React, {useEffect, useRef, useState} from 'react';
import {createContext, PropsWithChildren} from 'react';
import {getFirebaseAudioURL} from '../../../hooks/useGetCombinedAudioData';
import useLanguageSelector from '../../../context/LanguageSelector/useLanguageSelector';
import useMP3File from '../../../hooks/useMP3File';
import useLoadAudioInstance from '../../../hooks/useLoadAudioInstance';
import useMainAudioControls from '../../../hooks/useMainAudioControls';
export const SoundContext = createContext(null);

export const SoundProvider = ({
  sentenceData,
  children,
}: PropsWithChildren<{}>) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const {languageSelectedState} = useLanguageSelector();

  const soundRef = useRef();

  const id = sentenceData.id;
  const title = sentenceData.fullTitle;
  const isMediaContent = sentenceData.isMediaContent;
  const audioId = isMediaContent ? title : id;
  const soundDuration = soundRef?.current?._duration;

  const url = getFirebaseAudioURL(audioId, languageSelectedState);

  const {loadFile, filePath} = useMP3File(audioId);

  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
  });

  useEffect(() => {
    if (filePath) {
      triggerLoadURL();
    }
  }, [filePath]);

  const handleLoad = () => {
    loadFile(audioId, url);
  };

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

  const {playSound, pauseSound, forwardSound, rewindSound} =
    useMainAudioControls({
      soundRef,
      isPlaying,
      setIsPlaying,
      startTime: sentenceData?.isSnippetTime
        ? sentenceData?.isSnippetTime
        : isMediaContent
        ? sentenceData.time
        : null,
      rewindForwardInterval: 2,
      isMediaContent: isMediaContent,
    });
  const handleForward = (isForward: boolean) => {
    if (isForward) {
      forwardSound();
    } else {
      rewindSound();
    }
  };

  const handlePlay = () => {
    if (isPlaying) {
      pauseSound();
    } else {
      playSound();
    }
  };
  const progress = currentTimeState / soundDuration;

  return (
    <SoundContext.Provider
      value={{
        handlePlay,
        handleForward,
        playSound,
        isLoaded,
        handleLoad,
        progress,
        isPlaying,
      }}>
      {children}
    </SoundContext.Provider>
  );
};
