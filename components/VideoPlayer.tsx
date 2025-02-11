import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import Video, {SelectedTrackType} from 'react-native-video';
import {ActivityIndicator} from 'react-native-paper';

const VideoPlayer = ({
  url,
  videoRef,
  isPlaying,
  onProgressHandler,
  setVideoDuration,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {height} = Dimensions?.get('window');

  if (!url) {
    return null;
  }

  return (
    <>
      {isLoading && <ActivityIndicator size="large" />}
      <Video
        source={{uri: url}}
        ref={videoRef}
        style={{
          width: '100%',
          paddingBottom: 10,
          height: isLoading ? 0 : height * 0.25,
        }}
        resizeMode="contain"
        // controls
        paused={!isPlaying}
        onLoadStart={() => {
          setIsLoading(true);
        }}
        onLoad={data => {
          setIsLoading(false);
          setVideoDuration(data.duration);
        }}
        onReadyForDisplay={() => {
          setIsLoading(false);
        }}
        onProgress={data => onProgressHandler(data.currentTime)}
        ignoreSilentSwitch={'ignore'}
        selectedAudioTrack={{type: SelectedTrackType.SYSTEM}}
      />
    </>
  );
};

export default VideoPlayer;
