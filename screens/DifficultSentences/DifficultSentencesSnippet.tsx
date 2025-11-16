import {Text, View} from 'react-native';
import AudioSnippetPlayer from '../../components/AudioSnippetPlayer';
import {getFirebaseAudioURL} from '../../hooks/useGetCombinedAudioData';
import SRSTogglesScaled from '../../components/SRSTogglesScaled';
import {
  getDueDate,
  isMoreThanADayAhead,
  setToFiveAM,
  srsRetentionKeyTypes,
} from '../../srs-algo';
import {srsCalculationAndText} from '../../utils/srs/srs-calculation-and-text';
import {useEffect, useRef, useState} from 'react';
import useMP3File from '../../hooks/useMP3File';
import useLoadAudioInstance from '../../hooks/useLoadAudioInstance';

import React from 'react-native';
import {IconButton} from 'react-native-paper';

import useMainAudioControls from '../../hooks/useMainAudioControls';

const DifficultSnippetAudioControls = ({
  sentence,
  handleLoad,
  isLoaded,
  isPlaying,
  setIsPlaying,
  soundRef,
}) => {
  const {playSound, pauseSound} = useMainAudioControls({
    soundRef,
    isPlaying,
    setIsPlaying,
    startTime: sentence?.isMediaContent ? sentence.time : null,
    rewindForwardInterval: 2,
    isMediaContent: sentence?.isMediaContent,
  });

  const handlePlay = () => {
    if (!isLoaded) {
      handleLoad();
    } else {
      if (isPlaying) {
        pauseSound();
      } else {
        playSound();
      }
    }
  };

  const btnArr = [
    {
      icon: isLoaded && isPlaying ? 'pause' : 'play',
      onPress: handlePlay,
    },
  ];

  return (
    <>
      {btnArr.map((btn, index) => {
        return (
          <IconButton
            key={index}
            icon={btn.icon}
            mode="outlined"
            size={20}
            onPress={btn.onPress}
          />
        );
      })}
    </>
  );
};

const FocusedTextHighlighted = ({focusedText, targetLang}) => {
  const index = targetLang.indexOf(focusedText);

  if (index === -1) {
    // substring not found → show normally
    return <Text>{targetLang}</Text>;
  }

  const before = targetLang.slice(0, index);
  const match = targetLang.slice(index, index + focusedText.length);
  const after = targetLang.slice(index + focusedText.length);

  return (
    <Text>
      {before}
      <Text style={{backgroundColor: 'yellow', fontSize: 18}}>{match}</Text>
      {after}
    </Text>
  );
};

const DifficultSentencesSnippet = ({
  snippetData,
  languageSelectedState,
  updateContentSnippetsDataScreenLevel,
}) => {
  const topic = snippetData.topic;
  const generalTopic = snippetData.generalTopic;
  let startTime = snippetData.time;
  const isContracted = snippetData?.isContracted;
  const duration = isContracted ? 1.5 : 3;
  let endTime = startTime + duration;
  startTime = startTime - (isContracted ? 0.75 : 1.5);
  console.log('## generalTopic', generalTopic, topic);

  const url = getFirebaseAudioURL(generalTopic, languageSelectedState);

  const focusedText = snippetData.focusedText;
  const targetLang = snippetData.targetLang;
  const baseLang = snippetData.baseLang;

  const timeNow = new Date();

  const reviewData = snippetData?.reviewData;

  const hasDueDate = getDueDate(reviewData);

  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;

  const {againText, hardText, goodText, easyText, nextScheduledOptions} =
    srsCalculationAndText({
      reviewData,
      contentType: srsRetentionKeyTypes.snippet,
      timeNow,
    });

  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isTriggered, setIsTriggered] = useState(false);

  const soundRef = useRef();

  const {loadFile, filePath} = useMP3File(topic);
  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
    setIsPlaying,
  });

  useEffect(() => {
    if (soundRef.current) {
      const beforeLoopTime1500 = currentTimeState < startTime;
      const beyondLoopTime1500 = endTime < currentTimeState;

      if (beforeLoopTime1500 || beyondLoopTime1500) {
        soundRef.current.getCurrentTime(() => {
          soundRef.current.setCurrentTime(startTime);
        });
      }
      return;
    }
    if (soundRef.current) {
      const beforeStartTime = currentTimeState < snippetData.time;
      const beyondEndTime = snippetData?.endTime < currentTimeState;
      if (beforeStartTime || beyondEndTime) {
        soundRef.current.getCurrentTime(() => {
          soundRef.current.setCurrentTime(snippetData.time);
        });
      }
    }
  }, [snippetData, currentTimeState, soundRef, isPlaying]);

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
  }, [soundRef, setCurrentTimeState]);

  const handleLoad = () => {
    loadFile(topic, url);
  };

  useEffect(() => {
    if (filePath && !isLoaded) {
      triggerLoadURL();
    }
  }, [filePath, triggerLoadURL, isLoaded]);

  const quickDeleteFunc = async () => {
    await updateContentSnippetsDataScreenLevel({
      snippetId: snippetData.id,
      contentIndex: snippetData.contentIndex,
      isRemove: true,
    });
  };

  useEffect(() => {
    if (!isLoaded && !isTriggered) {
      setIsTriggered(true);
      loadFile(topic, url);
    }
  }, [loadFile, isLoaded, topic, url, isTriggered]);

  const handleNextReview = async difficulty => {
    const nextReviewData = nextScheduledOptions[difficulty].card;
    const isMoreThanADayAheadBool = isMoreThanADayAhead(
      nextReviewData.due,
      new Date(),
    );

    const formattedToBe5am = isMoreThanADayAheadBool
      ? {...nextReviewData, due: setToFiveAM(nextReviewData.due)}
      : nextReviewData;

    await updateContentSnippetsDataScreenLevel({
      snippetId: snippetData.id,
      fieldToUpdate: {reviewData: formattedToBe5am},
      contentIndex: snippetData.contentIndex,
    });
  };

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
      <FocusedTextHighlighted
        focusedText={focusedText}
        targetLang={targetLang}
      />
      <Text>{baseLang}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <DifficultSnippetAudioControls
          sentence={snippetData}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          soundRef={soundRef}
          handleLoad={handleLoad}
          isLoaded={isLoaded}
        />
        <SRSTogglesScaled
          handleNextReview={handleNextReview}
          againText={againText}
          hardText={hardText}
          goodText={goodText}
          easyText={easyText}
          fontSize={10}
          quickDeleteFunc={quickDeleteFunc}
        />
      </View>
    </View>
  );
};

export default DifficultSentencesSnippet;
