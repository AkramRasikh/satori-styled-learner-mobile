import {Animated, Text, View} from 'react-native';
import {getFirebaseAudioURL} from '../../hooks/useGetCombinedAudioData';
import SRSTogglesScaled from '../../components/SRSTogglesScaled';
import {
  getDueDate,
  isMoreThanADayAhead,
  setToFiveAM,
  srsRetentionKeyTypes,
} from '../../srs-algo';
import {srsCalculationAndText} from '../../utils/srs/srs-calculation-and-text';
import {useEffect, useMemo, useRef, useState} from 'react';
import useMP3File from '../../hooks/useMP3File';
import useLoadAudioInstance from '../../hooks/useLoadAudioInstance';

import React from 'react-native';
import {
  DefaultTheme,
  IconButton,
  MD2Colors,
  MD3Colors,
} from 'react-native-paper';

import useMainAudioControls from '../../hooks/useMainAudioControls';
import {getTimeDiffSRS} from '../../utils/getTimeDiffSRS';
import AnimationContainer from '../../components/AnimationContainer';
import useAnimation from '../../hooks/useAnimation';
import FlashCardLoadingSpinner from '../../components/FlashCard/FlashCardLoadingSpinner';
import useData from '../../context/Data/useData';
import DifficultSentenceMappedWords from '../../components/DifficultSentence/DifficultSentenceMappedWords';

export const DifficultSnippetAudioControls = ({
  sentence,
  handleLoad,
  isLoaded,
  isPlaying,
  setIsPlaying,
  soundRef,
  defaultPlayTime,
  isLoadingStateAudioState,
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
        if (defaultPlayTime) {
          soundRef.current.setCurrentTime(defaultPlayTime);
          soundRef.current.getCurrentTime(() => {
            soundRef.current.play(success => {
              if (!success) {
                console.log('Playback failed due to audio decoding errors');
              }
            });
          });
          setIsPlaying(true);
        } else {
          playSound();
        }
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
            disabled={isLoadingStateAudioState}
            style={{opacity: isLoadingStateAudioState ? 0.5 : 1}}
          />
        );
      })}
    </>
  );
};

export const FocusedTextHighlighted = ({focusedText, targetLang}) => {
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
  indexNum,
}) => {
  const [isCollapsingState, setIsCollapsingState] = useState(false);
  const [matchedWordListState, setMatchedWordListState] = useState([]);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const lastCheckRef = useRef(0);

  const topic = snippetData.topic;
  const generalTopic = snippetData.generalTopic;
  let startTime = snippetData.time;
  const isContracted = snippetData?.isContracted;
  const duration = isContracted ? 1.5 : 3;
  let endTime = startTime + duration;
  startTime = startTime - (isContracted ? 0.75 : 1.5);

  const url = getFirebaseAudioURL(generalTopic, languageSelectedState);

  const focusedText = snippetData.focusedText;
  const targetLang = snippetData.targetLang;
  const baseLang = snippetData.baseLang;

  const {collapseAnimation} = useAnimation({
    fadeAnim,
    scaleAnim,
  });

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
  const {getThisSentencesWordList} = useData();
  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
    setIsPlaying,
  });

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
  }, [snippetData, currentTimeState, soundRef, isPlaying, endTime, startTime]);

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
    const matchedWordList = getThisSentencesWordList(focusedText).map(
      (item, index) => ({
        ...item,
        colorIndex: index,
      }),
    );
    setMatchedWordListState(matchedWordList);
  }, [focusedText]);

  useEffect(() => {
    const isFirst2 = indexNum === 0 || indexNum === 1;

    if (isFirst2 && filePath && !isLoaded) {
      triggerLoadURL();
    }
  }, [filePath, triggerLoadURL, indexNum, isLoaded]);

  const stopAudioOnUnmount = () => {
    if (isPlaying && soundRef?.current) {
      soundRef?.current.stop(() => {
        setIsPlaying(false);
      });
    }
  };

  const quickDeleteFunc = async () => {
    try {
      stopAudioOnUnmount();
      // await collapseAnimation();
      // setIsLoadingState(true);
      setIsCollapsingState(true);
      await updateContentSnippetsDataScreenLevel({
        snippetId: snippetData.id,
        contentIndex: snippetData.contentIndex,
        isRemove: true,
      });
      if (soundRef?.current) {
        soundRef?.current.stop(() => {
          setIsPlaying(false);
        });
      }
    } catch (error) {
    } finally {
      setIsLoadingState(false);
      setIsCollapsingState(false);
    }
  };

  useEffect(() => {
    const isFirst2 = indexNum === 0 || indexNum === 1;
    if (!isLoaded && isFirst2 && !isTriggered) {
      setIsTriggered(true);
      loadFile(topic, url);
    }
  }, [loadFile, isLoaded, topic, url, isTriggered, indexNum]);

  const handleNextReview = async difficulty => {
    try {
      stopAudioOnUnmount();
      // await collapseAnimation();
      // setIsLoadingState(true);
      const nextReviewData = nextScheduledOptions[difficulty].card;
      const isMoreThanADayAheadBool = isMoreThanADayAhead(
        nextReviewData.due,
        new Date(),
      );

      const formattedToBe5am = isMoreThanADayAheadBool
        ? {...nextReviewData, due: setToFiveAM(nextReviewData.due)}
        : nextReviewData;

      setIsCollapsingState(true);
      await updateContentSnippetsDataScreenLevel({
        snippetId: snippetData.id,
        fieldToUpdate: {reviewData: formattedToBe5am},
        contentIndex: snippetData.contentIndex,
      });
      if (soundRef?.current) {
        soundRef?.current.stop(() => {
          setIsPlaying(false);
        });
      }
    } catch (error) {
    } finally {
      setIsLoadingState(false);
      setIsCollapsingState(false);
    }
  };

  const hideAllTogetherStateMemoized = useMemo(() => {
    if (isCollapsingState) {
      return setTimeout(() => true, 400);
    }
    return false;
  }, [isCollapsingState]);

  if (hideAllTogetherStateMemoized) {
    return null;
  }
  if (isCollapsingState) {
    return <FlashCardLoadingSpinner />;
  }

  return (
    <AnimationContainer fadeAnim={fadeAnim} scaleAnim={scaleAnim}>
      <View
        style={{
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'center',
          opacity: isLoadingState ? 0.5 : 1,
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
            defaultPlayTime={startTime}
            isLoadingStateAudioState={!isLoaded && isTriggered}
          />
          {hasDueDateInFuture ? (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
              }}>
              <Text
                style={{
                  ...DefaultTheme.fonts.bodySmall,
                  alignSelf: 'center',
                  fontStyle: 'italic',
                }}>
                Due in {getTimeDiffSRS({dueTimeStamp: hasDueDate, timeNow})}
              </Text>
              <IconButton
                icon="delete"
                containerColor={MD3Colors.error50}
                iconColor={MD2Colors.white}
                size={20}
                onPress={quickDeleteFunc}
              />
            </View>
          ) : (
            <SRSTogglesScaled
              handleNextReview={handleNextReview}
              againText={againText}
              hardText={hardText}
              goodText={goodText}
              easyText={easyText}
              fontSize={10}
              quickDeleteFunc={quickDeleteFunc}
            />
          )}
        </View>
        <View style={{width: '100%'}}>
          {matchedWordListState.map((item, index) => {
            return (
              <DifficultSentenceMappedWords
                key={index}
                item={item}
                handleSelectWord={() => {}}
                deleteWord={() => {}}
                handleUpdateWordFinal={() => {}}
                indexNum={index}
                combineWordsListState={[]}
                setCombineWordsListState={() => {}}
              />
            );
          })}
        </View>
      </View>
    </AnimationContainer>
  );
};

export default DifficultSentencesSnippet;
