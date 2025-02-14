import React, {createContext, PropsWithChildren, useRef, useState} from 'react';
import {VideoRef} from 'react-native-video';

export const TopicContentVideoContext = createContext(null);

export const TopicContentVideoProvider = ({
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
    jumpToAudioPoint(realStartTime + playFromHere);
    if (!isVideoPlaying) {
      playVideo();
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
      }}>
      {children}
    </TopicContentVideoContext.Provider>
  );
};
