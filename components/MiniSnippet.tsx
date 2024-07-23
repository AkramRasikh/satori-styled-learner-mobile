import {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import useSoundHook from '../hooks/useSoundHook';

export const MiniSnippet = ({
  snippet,
  setMasterAudio,
  masterAudio,
  soundRef,
  index,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const pointInAudio = snippet.pointInAudio;
  const [currentTimeState, setCurrentTimeState] = useState(pointInAudio);

  const url = snippet.url;
  const duration = snippet.duration;
  const isInDB = snippet?.saved;
  const topicName = snippet.topicName + '-' + pointInAudio.toFixed(2);

  useEffect(() => {
    const getCurrentTimeFunc = () => {
      soundRef.current.getCurrentTime(currentTime => {
        setCurrentTimeState(currentTime);
      });
    };
    const interval = setInterval(() => {
      if (soundRef.current && soundRef.current?.isPlaying() && isPlaying) {
        getCurrentTimeFunc();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [soundRef, pointInAudio, duration, isInDB, isPlaying]);

  useEffect(() => {
    if (masterAudio && isPlaying) {
      setMasterAudio(false);
    }
  }, [masterAudio, setMasterAudio, isPlaying]);

  const {playSound, pauseSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
    isSnippet: true,
    startTime: pointInAudio,
    duration: duration,
    setCurrentTime: setCurrentTimeState,
    index,
    currentTime: currentTimeState,
  });

  const handlePlay = () => {
    playSound();
  };

  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: isPlaying ? 'green' : 'red',
            padding: 5,
            borderRadius: 5,
          }}>
          {isPlaying ? (
            <TouchableOpacity onPress={pauseSound}>
              <Text>⏸️ Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handlePlay}>
              <Text>▶️ Play</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
