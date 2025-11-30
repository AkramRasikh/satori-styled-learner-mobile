import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Text, View} from 'react-native';
import {FocusedTextHighlighted} from './DifficultSentencesSnippet';
import useMP3File from '../../hooks/useMP3File';
import useData from '../../context/Data/useData';
import useLoadAudioInstance from '../../hooks/useLoadAudioInstance';
import {getFirebaseAudioURL} from '../../hooks/useGetCombinedAudioData';
import DifficultSentenceMappedWords from '../../components/DifficultSentence/DifficultSentenceMappedWords';
import SRSTogglesScaled from '../../components/SRSTogglesScaled';
import {
  isMoreThanADayAhead,
  setToFiveAM,
  srsRetentionKeyTypes,
} from '../../srs-algo';
import {srsCalculationAndText} from '../../utils/srs/srs-calculation-and-text';
import FlashCardLoadingSpinner from '../../components/FlashCard/FlashCardLoadingSpinner';
import useAnimation from '../../hooks/useAnimation';
import {
  ActivityIndicator,
  Divider,
  IconButton,
  MD2Colors,
} from 'react-native-paper';
import AnimationContainer from '../../components/AnimationContainer';

const NestedSnippetData = ({
  item,
  isPlaying,
  setIsPlaying,
  soundRef,
  updateContentSnippetsDataScreenLevel,
  isLoaded,
  setSelectedIndexState,
  selectedIndexState,
  playThisSnippet,
  indexNum,
}) => {
  const [isCollapsingState, setIsCollapsingState] = useState(false);
  const [matchedWordListState, setMatchedWordListState] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const focusedText = item.focusedText;
  const targetLang = item.targetLang;
  const baseLang = item.baseLang;

  const {getThisSentencesWordList} = useData();
  const timeNow = new Date();

  const {collapseAnimation} = useAnimation({
    fadeAnim,
    scaleAnim,
  });

  const reviewData = item?.reviewData;

  const {againText, hardText, goodText, easyText, nextScheduledOptions} =
    srsCalculationAndText({
      reviewData,
      contentType: srsRetentionKeyTypes.snippet,
      timeNow,
    });

  useEffect(() => {
    const matchedWordList = getThisSentencesWordList(focusedText).map(
      (item, index) => ({
        ...item,
        colorIndex: index,
      }),
    );
    setMatchedWordListState(matchedWordList);
  }, [focusedText]);

  const stopAudioOnUnmount = () => {
    if (isPlaying && soundRef?.current) {
      soundRef?.current.stop(() => {
        setIsPlaying(false);
      });
    }
  };

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
        snippetId: item.id,
        fieldToUpdate: {reviewData: formattedToBe5am},
        contentIndex: item.contentIndex,
      });
      if (soundRef?.current) {
        soundRef?.current.stop(() => {
          setIsPlaying(false);
        });
      }
    } catch (error) {
    } finally {
      // setIsLoadingState(false);
      setIsCollapsingState(false);
    }
  };

  const quickDeleteFunc = async () => {
    try {
      stopAudioOnUnmount();
      // await collapseAnimation();
      // setIsLoadingState(true);
      setIsCollapsingState(true);
      await updateContentSnippetsDataScreenLevel({
        snippetId: item.id,
        contentIndex: item.contentIndex,
        isRemove: true,
      });
      if (soundRef?.current) {
        soundRef?.current.stop(() => {
          setIsPlaying(false);
        });
      }
    } catch (error) {
    } finally {
      // setIsLoadingState(false);
      setIsCollapsingState(false);
    }
  };

  const handlePlayThisSnippet = () => {
    if (selectedIndexState === item.id && isPlaying) {
      stopAudioOnUnmount();
    } else if (selectedIndexState === item.id && !isPlaying) {
      playThisSnippet(item.time);
    } else {
      setSelectedIndexState(item.id);
      playThisSnippet(item.time);
    }
  };

  const thisIsPlaying = item.id === selectedIndexState && isLoaded && isPlaying;

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
      <View>
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
          <IconButton
            icon={thisIsPlaying ? 'pause' : 'play'}
            mode="outlined"
            size={20}
            onPress={handlePlayThisSnippet}
            // disabled={isLoadingStateAudioState}
            // style={{opacity: isLoadingStateAudioState ? 0.5 : 1}}
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
      <Divider bold style={{marginTop: 5}} />
    </AnimationContainer>
  );
};

const DifficultSentencesGrandSnippetContainer = ({
  displayedStudyItems,
  languageSelectedState,
  updateContentSnippetsDataScreenLevel,
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

  const topic = displayedStudyItems[selectedIndexState].topic;
  const generalTopic = displayedStudyItems[selectedIndexState].generalTopic;
  const url = getFirebaseAudioURL(generalTopic, languageSelectedState);
  const snippetData = displayedStudyItems[selectedIndexState];
  let startTime = snippetData.time;
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
            <NestedSnippetData
              key={index}
              indexNum={index}
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
            />
          );
        })}
      </View>
    </View>
  );
};

export default DifficultSentencesGrandSnippetContainer;
