import {useRef, useState} from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import VideoPlayer from '../../components/VideoPlayer';

import AudioToggles from '../../components/AudioToggles';
import {getFirebaseVideoURL} from '../../hooks/useGetCombinedAudioData';

const VideoTestScreen = () => {
  const numbers = Array.from({length: 100}, (_, i) => i + 1);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const seekToTimestamp = seconds => {
    videoRef.current.seek(seconds);
  };

  const title = 'meiji-era-intro';
  const url = getFirebaseVideoURL(title, 'japanese');

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
    <ScreenContainerComponent>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <VideoPlayer url={url} />
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text>{title}</Text>
        </View>
        <View
          style={{
            height: height * 0.4,
          }}>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            {numbers.map((num, index) => {
              return (
                <View
                  key={num}
                  style={{
                    padding: '10',
                    backgroundColor: 'red',
                  }}>
                  <Text>{index}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View>
          <AudioToggles
            soundRef={videoRef}
            isPlaying={isPlaying}
            playSound={() => setIsPlaying(!isPlaying)}
            pauseSound={pauseSound}
            rewindSound={rewindSound}
            forwardSound={forwardSound}
            getTimeStamp={getTimeStamp}
            jumpAudioValue={jumpAudioValue}
            seekToTimestamp={seekToTimestamp}
          />
        </View>
      </View>
    </ScreenContainerComponent>
  );
};

export default VideoTestScreen;
