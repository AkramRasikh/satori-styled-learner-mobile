import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import useMP3File from '../../../hooks/useMP3File';
import Sound from 'react-native-sound';
import useLoadAudioInstance from '../../../hooks/useLoadAudioInstance';
import {getFirebaseAudioURL} from '../../../hooks/useGetCombinedAudioData';
import useLanguageSelector from '../../../context/LanguageSelector/useLanguageSelector';
import {VideoRef} from 'react-native-video';
import useSoundHook from '../../../hooks/useSoundHook';

export const TopicContentAudioContext = createContext(null);

export const TopicContentAudioProvider = ({
  topicName,
  realStartTime,
  children,
}: PropsWithChildren<{}>) => {
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoTimeState, setCurrentVideoTimeState] = useState(0);
  const [videoDurationState, setVideoDurationState] = useState(0);
  const [isVideoModeState, setIsVideoModeState] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const {languageSelectedState} = useLanguageSelector();

  const soundRef = useRef<Sound>(null);
  const videoRef = useRef<VideoRef>(null);

  const videoInstance = videoRef?.current;

  const progress =
    currentVideoTimeState && videoDurationState
      ? currentVideoTimeState / videoDurationState
      : 0;

  const {playSound, pauseSound, rewindSound, forwardSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
  });

  const url = getFirebaseAudioURL(topicName, languageSelectedState);

  const {loadFile, filePath} = useMP3File(topicName);

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
    loadFile(topicName, url);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  const jumpToAudioPoint = (videoPosition: number) => {
    if (!videoInstance) {
      return null;
    }
    videoInstance.seek(videoPosition);
  };

  const jumpAudioValue = 2;

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
    if (isVideoModeState) {
      jumpToAudioPoint(realStartTime + playFromHere);
      if (!isVideoPlaying) {
        playVideo();
      }
    } else {
      playFromThisSentence(playFromHere);
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

  const handleVideoPause = () => {
    if (isVideoPlaying && isVideoModeState) {
      setIsVideoPlaying(false);
    }
  };

  return (
    <TopicContentAudioContext.Provider
      value={{
        isLoaded,
        currentTimeState,
        soundRef,
        currentVideoTimeState,
        videoRef,
        isVideoPlaying,
        progress,
        isPlaying,
        isVideoModeState,
        seekHandler,
        handlePlayFromThisSentence,
        playFromHere,
        setIsPlaying,
        handleVideoPause,
        setCurrentVideoTimeState,
        setVideoDurationState,
        playVideo,
        setIsVideoModeState,
        setCurrentTimeState,
        playSound,
        pauseSound,
        rewindSound,
        forwardSound,
      }}>
      {children}
    </TopicContentAudioContext.Provider>
  );
};
