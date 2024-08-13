import {Text, TouchableOpacity, View} from 'react-native';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import {useEffect, useRef, useState} from 'react';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import useSoundHook from '../hooks/useSoundHook';
import ProgressBarComponent from './Progress';

const SoundWidget = ({soundRef, url, topicName}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  // const [currentTimeState, setCurrentTimeState] = useState(0);

  // console.log('## soundRef', soundRef.current.isLoaded());

  // useEffect(() => {
  //   const getCurrentTimeFunc = () => {
  //     soundRef.current.getCurrentTime(currentTime => {
  //       setCurrentTimeState(currentTime);
  //     });
  //   };
  //   const interval = setInterval(() => {
  //     if (soundRef.current && soundRef.current?.isPlaying() && isPlaying) {
  //       getCurrentTimeFunc();
  //     }
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, [soundRef, isPlaying]);

  // const {playSound, pauseSound} = useSoundHook({
  //   url,
  //   soundRef,
  //   isPlaying,
  //   setIsPlaying,
  //   topicName,
  //   isSnippet: true,
  // });
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
            <TouchableOpacity onPress={playSound}>
              <Text>▶️ Play</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* <ProgressBarComponent
        progress={10}
        time={(1).toFixed(2)}
        endTime={soundRef.current.duration}
      /> */}
    </View>
  );
};

const Content = ({topic, isCore, targetLang, baseLang}) => {
  return (
    <>
      <Text
        style={{
          fontStyle: 'italic',
          textDecorationLine: 'underline',
        }}>
        {topic} {isCore ? '🧠' : ''}
      </Text>
      <View>
        <Text>{targetLang}</Text>
      </View>
      <View>
        <Text>{baseLang}</Text>
      </View>
    </>
  );
};

const DifficultSentenceWidget = ({sentence}) => {
  // const DifficultSentenceWidget = ({sentence, getDaysLater}) => {
  // const [loadURL, setLoadURL] = useState(false);
  const id = sentence.id;
  const topic = sentence.topic;
  const isCore = sentence?.isCore;
  const baseLang = sentence.baseLang;
  const targetLang = sentence.targetLang;

  // const soundRef = useRef();
  // const url = getFirebaseAudioURL(id);

  // const {triggerLoadURL, soundState} = useLoadAudioInstance({soundRef, url});

  // const loadURLfunc = () => {
  //   if (!soundState) {
  //     triggerLoadURL();
  //   }
  // };

  // useEffect(() => {
  //   if (soundState) {
  //     setLoadURL(true);
  //     soundRef.current = soundState;
  //   }
  // }, [soundState, soundRef, loadURL]);

  return (
    <View
      key={id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginBottom: 10,
      }}>
      <Content
        topic={topic}
        isCore={isCore}
        targetLang={targetLang}
        baseLang={baseLang}
      />
    </View>
  );
};

export default DifficultSentenceWidget;
