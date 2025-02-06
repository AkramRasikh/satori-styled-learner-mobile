import React, {useRef, useState} from 'react';
import AudioToggles from './AudioToggles';
import VideoPlayer from './VideoPlayer';
import {VideoRef} from 'react-native-video';
import {View} from 'react-native';

const TopicVideoContainer = ({videoUrl}) => {
  const videoRef = useRef<VideoRef>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentVideoTimeState, setCurrentVideoTimeState] = useState(0);
  const [videoDurationState, setVideoDurationState] = useState(0);

  const jumpAudioValue = 2;

  const progress =
    currentVideoTimeState && videoDurationState
      ? currentVideoTimeState / videoDurationState
      : 0;

  const videoInstance = videoRef?.current;

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

  return (
    <View>
      <VideoPlayer
        url={videoUrl}
        videoRef={videoRef}
        isPlaying={isVideoPlaying}
        onProgressHandler={setCurrentVideoTimeState}
        setVideoDuration={setVideoDurationState}
      />
      <AudioToggles
        isPlaying={isVideoPlaying}
        playSound={playVideo}
        seekHandler={seekHandler}
        progress={progress}
      />
    </View>
  );
};

export default TopicVideoContainer;
