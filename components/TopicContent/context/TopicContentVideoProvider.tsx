import React, {createContext, PropsWithChildren, useRef, useState} from 'react';
import {VideoRef} from 'react-native-video';

export const TopicContentVideoContext = createContext(null);

export const TopicContentVideoProvider = ({
  secondsToSentencesMapState,
  loadedContent,
  realStartTime,
  children,
}: PropsWithChildren<{}>) => {
  const [currentVideoTimeState, setCurrentVideoTimeState] = useState(0);
  const [videoDurationState, setVideoDurationState] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const videoRef = useRef<VideoRef>(null);

  const videoInstance = videoRef?.current;

  const progress =
    currentVideoTimeState && videoDurationState
      ? currentVideoTimeState / videoDurationState
      : 0;

  const jumpToAudioPoint = (videoPosition: number) => {
    if (!videoInstance) {
      return null;
    }
    videoInstance.seek(videoPosition);
  };

  const jumpAudioValue = 3;

  const seekHandler = (isForward: boolean) => {
    if (!videoInstance) {
      return null;
    }
    if (isForward) {
      videoInstance.seek(currentVideoTimeState + jumpAudioValue);
    } else {
      videoInstance.seek(currentVideoTimeState - jumpAudioValue);
    }
  };

  const playVideo = () => {
    if (isVideoPlaying) {
      setIsVideoPlaying(false);
    } else {
      setIsVideoPlaying(true);
    }
  };

  const handlePlayFromThisSentence = playFromHere => {
    jumpToAudioPoint(realStartTime + (playFromHere || 0)); // fix playFromHere
    if (!isVideoPlaying) {
      playVideo();
    }
  };

  const handlePreviousSentence = () => {
    const currentlyPlayingId =
      secondsToSentencesMapState[Math.floor(currentVideoTimeState)];
    const index = loadedContent.content.findIndex(
      i => i.id === currentlyPlayingId,
    );

    const previousSentence = index - 1;
    if (previousSentence >= 0) {
      const topicSentence = loadedContent.content[previousSentence];
      if (topicSentence) {
        handlePlayFromThisSentence(
          topicSentence?.startAt || topicSentence.time,
        );
      }
    }
  };

  const handleLoopThisSentence = () => {
    const currentlyPlayingId =
      secondsToSentencesMapState[Math.floor(currentVideoTimeState)];
    const index = loadedContent.content.findIndex(
      i => i.id === currentlyPlayingId,
    );

    const topicSentence = loadedContent.content[index];
    if (topicSentence) {
      handlePlayFromThisSentence(topicSentence?.startAt || topicSentence.time);
    }
  };

  const handleVideoPause = () => {
    if (isVideoPlaying) {
      setIsVideoPlaying(false);
    }
  };

  return (
    <TopicContentVideoContext.Provider
      value={{
        currentVideoTimeState,
        videoRef,
        isVideoPlaying,
        progress,
        seekHandler,
        handlePlayFromThisSentence,
        handleVideoPause,
        setCurrentVideoTimeState,
        setVideoDurationState,
        playVideo,
        handleLoopThisSentence,
        handlePreviousSentence,
      }}>
      {children}
    </TopicContentVideoContext.Provider>
  );
};
