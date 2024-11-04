import React, {useRef, useState} from 'react';
import {Dimensions} from 'react-native';
import Video from 'react-native-video';
import {ActivityIndicator} from 'react-native-paper';

const VideoPlayer = ({url}) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // const seekToTimestamp = seconds => {
  //   videoRef.current.seek(seconds);
  // };

  const {height} = Dimensions?.get('window');

  const playSound = () => {};
  const pauseSound = () => {};
  const rewindSound = () => {};
  const forwardSound = () => {};
  const getTimeStamp = () => {};
  const jumpAudioValue = 2;

  if (!url) {
    return null;
  }

  return (
    <>
      {isLoading && <ActivityIndicator size="large" />}
      <Video
        source={{uri: url}}
        ref={videoRef}
        style={{width: '100%', height: isLoading ? 0 : height * 0.35}}
        resizeMode="contain"
        controls
        muted
        onLoadStart={() => {
          console.log('## onLoadStart');
          setIsLoading(true);
        }}
        onLoad={() => {
          console.log('## onLoad');
          setIsLoading(false);
        }}
        onReadyForDisplay={() => {
          console.log('## onReadyForDisplay');
          setIsLoading(false);
        }}
      />
    </>
  );
};

export default VideoPlayer;
