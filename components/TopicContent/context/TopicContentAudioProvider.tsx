import React, {createContext, PropsWithChildren, useState} from 'react';
import {getFirebaseAudioURL} from '../../../hooks/useGetCombinedAudioData';
import useLanguageSelector from '../../../context/LanguageSelector/useLanguageSelector';
import useSoundHook from '../../../hooks/useSoundHook';

export const TopicContentAudioContext = createContext(null);

export const TopicContentAudioProvider = ({
  secondsToSentencesMapState,
  loadedContent,
  topicName,
  soundRef,
  children,
}: PropsWithChildren<{}>) => {
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const {languageSelectedState} = useLanguageSelector();

  const {playSound, pauseSound, rewindSound, forwardSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
  });

  const url = getFirebaseAudioURL(topicName, languageSelectedState);

  const handlePlayFromThisSentence = playFromHere => {
    playFromThisSentence(playFromHere);
  };

  const handlePreviousSentence = () => {
    const currentlyPlayingId =
      secondsToSentencesMapState[Math.floor(currentTimeState)];
    const index = loadedContent.content.findIndex(
      i => i.id === currentlyPlayingId,
    );

    const previousSentence = index - 1;
    if (previousSentence >= 0) {
      const topicSentence = loadedContent.content[previousSentence];
      if (topicSentence) {
        playFromThisSentence(topicSentence?.startAt || topicSentence.time);
      }
    }
  };
  const handleLoopThisSentence = () => {
    const currentlyPlayingId =
      secondsToSentencesMapState[Math.floor(currentTimeState)];
    const index = loadedContent.content.findIndex(
      i => i.id === currentlyPlayingId,
    );

    const topicSentence = loadedContent.content[index];
    if (topicSentence) {
      playFromThisSentence(topicSentence?.startAt || topicSentence.time);
    }
  };

  const playFromHere = seconds => {
    if (soundRef.current) {
      soundRef.current.getCurrentTime(() => {
        soundRef.current.setCurrentTime(seconds);
      });
      setCurrentTimeState(seconds);
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const playFromThisSentence = playFromHere => {
    if (soundRef.current && isFinite(playFromHere)) {
      soundRef.current.getCurrentTime(() => {
        soundRef.current.setCurrentTime(playFromHere);
      });
      setCurrentTimeState(playFromHere);
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <TopicContentAudioContext.Provider
      value={{
        currentTimeState,
        soundRef,
        isPlaying,
        handlePlayFromThisSentence,
        playFromHere,
        setIsPlaying,
        setCurrentTimeState,
        playSound,
        pauseSound,
        rewindSound,
        forwardSound,
        handlePreviousSentence,
        handleLoopThisSentence,
      }}>
      {children}
    </TopicContentAudioContext.Provider>
  );
};
