import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import useMP3File from '../../hooks/useMP3File';
import useLoadAudioInstance from '../../hooks/useLoadAudioInstance';
import {getFirebaseAudioURL} from '../../hooks/useGetCombinedAudioData';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';
import SnippetContainer from './Snippets/SnippetContainer';

const DifficultSentencesGrandSnippetContainer = ({
  displayedStudyItems,
  languageSelectedState,
  updateContentSnippetsDataScreenLevel,
  underlineWordsInSentence,
}) => {
  const [selectedIndexState, setSelectedIndexState] = useState(
    displayedStudyItems[0].id,
  );

  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isTriggered, setIsTriggered] = useState(false);

  const soundRef = useRef();

  const displayedStudyItemsMemoizedMap = useMemo(() => {
    const displayedStudyItemsMap = {};

    displayedStudyItems.forEach(item => {
      displayedStudyItemsMap[item.id] = {
        id: item.id,
        topic: item.topic,
        generalTopic: item.generalTopic,
        time: item.time,
        isContracted: item.isContracted,
      };
    });

    return displayedStudyItemsMap;
  }, [displayedStudyItems]);

  const topic = displayedStudyItems[0].topic;
  const generalTopic = displayedStudyItems[0].generalTopic;
  const url = getFirebaseAudioURL(generalTopic, languageSelectedState);
  const snippetData = displayedStudyItemsMemoizedMap[selectedIndexState];
  let startTime = snippetData?.time;
  const isContracted = snippetData?.isContracted;
  const duration = isContracted ? 1.5 : 3;
  let endTime = startTime + duration;
  startTime = startTime - (isContracted ? 0.75 : 1.5);

  const {loadFile, filePath} = useMP3File(topic);
  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
    setIsPlaying,
  });

  const lastCheckRef = useRef(0);

  useEffect(() => {
    const now = Date.now();

    // throttle: only run every 200ms
    if (now - lastCheckRef.current < 200) {
      return;
    }
    lastCheckRef.current = now;
    if (soundRef.current) {
      const beforeLoopTime1500 = currentTimeState < startTime;
      const beyondLoopTime1500 = endTime < currentTimeState;

      if (beforeLoopTime1500 || beyondLoopTime1500) {
        soundRef.current.getCurrentTime(() => {
          soundRef.current.setCurrentTime(startTime);
        });
      }
    }
  }, [currentTimeState, soundRef, isPlaying, endTime, startTime]);

  useEffect(() => {
    const getCurrentTimeFunc = () => {
      soundRef.current.getCurrentTime(currentTime => {
        setCurrentTimeState(currentTime);
      });
    };
    const interval = setInterval(() => {
      if (soundRef.current?.isPlaying()) {
        getCurrentTimeFunc();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [soundRef, setCurrentTimeState, isPlaying]);

  const playThisSnippet = thisTime => {
    soundRef.current.setCurrentTime(thisTime);
    soundRef.current.getCurrentTime(() => {
      soundRef.current.play(success => {
        if (!success) {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    });
    setIsPlaying(true);
  };

  useEffect(() => {
    if (filePath && !isLoaded) {
      triggerLoadURL();
    }
  }, [filePath, triggerLoadURL, isLoaded]);

  useEffect(() => {
    if (!isLoaded && !isTriggered) {
      setIsTriggered(true);
      loadFile(topic, url);
    }
  }, [loadFile, isLoaded, topic, url, isTriggered]);

  return (
    <View
      style={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
      }}>
      <Text>{topic}</Text>
      <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        {!isLoaded && isTriggered && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
              marginBottom: 20,
            }}>
            <ActivityIndicator
              animating={true}
              color={MD2Colors.red800}
              size="large"
            />
          </View>
        )}
      </View>
      <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        {displayedStudyItems.map((item, index) => {
          return (
            <SnippetContainer
              key={index}
              item={item}
              updateContentSnippetsDataScreenLevel={
                updateContentSnippetsDataScreenLevel
              }
              soundRef={soundRef}
              setSelectedIndexState={setSelectedIndexState}
              selectedIndexState={selectedIndexState}
              isLoaded={isLoaded}
              isPlaying={isPlaying}
              playThisSnippet={playThisSnippet}
              setIsPlaying={setIsPlaying}
              underlineWordsInSentence={underlineWordsInSentence}
            />
          );
        })}
      </View>
    </View>
  );
};

export default DifficultSentencesGrandSnippetContainer;
