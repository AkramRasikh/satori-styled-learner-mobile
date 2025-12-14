import React, {useEffect, useRef, useState} from 'react';
import {Animated, Text, View} from 'react-native';
import useMP3File from '../../hooks/useMP3File';
import useData from '../../context/Data/useData';
import useLoadAudioInstance from '../../hooks/useLoadAudioInstance';
import {getFirebaseAudioURL} from '../../hooks/useGetCombinedAudioData';
import DifficultSentenceTextContainer from '../../components/DifficultSentence/DifficultSentenceTextContainer';
import {getHexCode} from '../../utils/get-hex-code';
import {DoubleClickButton} from '../../components/Button';
import TextSegment from '../../components/TextSegment';
import {checkOverlap} from '../../utils/check-word-overlap';
import TextSegmentContainer from '../../components/TextSegmentContainer';
import {isCardDue} from '../../utils/is-card-due';
import {
  ActivityIndicator,
  DefaultTheme,
  IconButton,
  MD2Colors,
} from 'react-native-paper';
import {
  isMoreThanADayAhead,
  setToFiveAM,
  srsRetentionKeyTypes,
} from '../../srs-algo';
import {srsCalculationAndText} from '../../utils/srs/srs-calculation-and-text';
import FlashCardLoadingSpinner from '../../components/FlashCard/FlashCardLoadingSpinner';
import SRSTogglesScaled from '../../components/SRSTogglesScaled';
import useHighlightWordToWordBank from '../../hooks/useHighlightWordToWordBank';

const NestedSentence = ({
  sentence,
  underlineWordsInSentence,
  updateSentenceData,
  stopAudioOnUnmount,
  indexNum,
  selectedIndexState,
  isLoaded,
  isPlaying,
  playThisSnippet,
  setSelectedIndexState,
  currentTimeState,
}) => {
  const [isCollapsingState, setIsCollapsingState] = useState(false);
  const [isHighlightMode, setHighlightMode] = useState(false);
  const [matchedWordListState, setMatchedWordListState] = useState([]);
  const [showAllMatchedWordsState, setShowAllMatchedWordsState] =
    useState(false);
  const [showSentenceBreakDown, setShowSentenceBreakDown] = useState(false);
  const [hideAllTogetherState, setHideAllTogetherState] = useState(false);

  const textSegments = underlineWordsInSentence(sentence.targetLang);
  const hasSentenceBreakdown = sentence?.vocab;
  const revealSentenceBreakdown = showSentenceBreakDown && hasSentenceBreakdown;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const isThisAudioPlayingInRange =
    indexNum === selectedIndexState &&
    isPlaying &&
    currentTimeState >= sentence.time &&
    currentTimeState <= sentence.endTime;

  useEffect(() => {
    if (isCollapsingState) {
      const id = setTimeout(() => setHideAllTogetherState(true), 300);
      return () => clearTimeout(id);
    }
  }, [isCollapsingState]);

  const {pureWords, getThisSentencesWordList, saveWordFirebase} = useData();

  const numberOfWords = pureWords.length;
  const timeNow = new Date();

  const reviewCardDue = sentence.reviewData?.due;
  const reviewData = sentence.reviewData;

  const isDueState = reviewCardDue
    ? isCardDue({cardDate: new Date(reviewCardDue), nowDate: timeNow})
    : false;

  // const isEasyFollowedByDeletion = () => {
  //   const nextScheduledOptionsDelete = getNextScheduledOptions({
  //     card: cardDataRelativeToNow,
  //     contentType: srsRetentionKeyTypes.sentences,
  //   });
  //   const nextReviewData = nextScheduledOptionsDelete?.['4'].card;
  //   const futureReviewData = srsCalculationAndText({
  //     reviewData: nextReviewData,
  //     contentType: srsRetentionKeyTypes.sentences,
  //     timeNow,
  //   });

  //   return futureReviewData?.isScheduledForDeletion;
  // };

  // const willBeFollowedByDeletion = isEasyFollowedByDeletion();

  const {
    againText,
    hardText,
    goodText,
    easyText,
    nextScheduledOptions,
    isScheduledForDeletion,
  } = srsCalculationAndText({
    reviewData,
    contentType: srsRetentionKeyTypes.sentences,
    timeNow,
  });

  const handlePlayThisSnippet = () => {
    if (selectedIndexState === indexNum && isPlaying) {
      stopAudioOnUnmount();
    } else if (selectedIndexState === indexNum && !isPlaying) {
      playThisSnippet(sentence.time);
    } else {
      setSelectedIndexState(indexNum);
      playThisSnippet(sentence.time);
    }
  };

  const handleDeleteContent = async () => {
    try {
      stopAudioOnUnmount();
      // setIsCollapsingState(true);
      // await collapseAnimation();
      await updateSentenceData({
        isAdhoc: sentence?.isAdhoc,
        topicName: sentence.topic,
        sentenceId: sentence.id,
        fieldToUpdate: sentence?.isAdhoc
          ? {
              reviewData: {},
            }
          : {
              removeReview: true,
            },
        contentIndex: sentence?.contentIndex,
        indexKey: sentence?.indexKey,
      });
    } catch (error) {
      setIsCollapsingState(false);
    } finally {
    }
  };
  const handleNextReview = async difficulty => {
    try {
      stopAudioOnUnmount();
      // setIsCollapsingState(true);
      // await collapseAnimation();
      // const nextScheduledOptions = getNextScheduledOptions({
      //   card: cardDataRelativeToNow,
      //   contentType: srsRetentionKeyTypes.sentences,
      // });
      const nextReviewData = nextScheduledOptions[difficulty].card;
      const isMoreThanADayAheadBool = isMoreThanADayAhead(
        nextReviewData.due,
        new Date(),
      );

      const formattedToBe5am = isMoreThanADayAheadBool
        ? {...nextReviewData, due: setToFiveAM(nextReviewData.due)}
        : nextReviewData;

      if (isScheduledForDeletion) {
        await updateSentenceData({
          isAdhoc: sentence?.isAdhoc,
          topicName: sentence.topic,
          sentenceId: sentence.id,
          fieldToUpdate: sentence?.isAdhoc
            ? {
                reviewData: {},
              }
            : {
                removeReview: true,
              },
          contentIndex: sentence?.contentIndex,
          indexKey: sentence?.indexKey,
        });
      } else {
        await updateSentenceData({
          isAdhoc: false,
          topicName: sentence.topic,
          sentenceId: sentence.id,
          fieldToUpdate: {
            reviewData: formattedToBe5am,
          },
          contentIndex: sentence?.contentIndex,
          indexKey: sentence?.indexKey,
        });
      }
    } catch (error) {
      setIsCollapsingState(false);
    } finally {
    }
  };

  useEffect(() => {
    const matchedWordList = getThisSentencesWordList(sentence.targetLang).map(
      (item, index) => ({
        ...item,
        colorIndex: index,
      }),
    );
    setMatchedWordListState(matchedWordList);
  }, [numberOfWords]);

  const handleSettingHighlightmode = () => {
    setHighlightMode(!isHighlightMode);
  };

  const handleShowAllMatchedWords = () => {
    setShowAllMatchedWordsState(!showAllMatchedWordsState);
  };
  const getSafeTextDefault = () => {
    return (
      <DoubleClickButton
        onLongPress={
          matchedWordListState?.length > 0
            ? () => handleShowAllMatchedWords()
            : () => {}
        }
        onPress={handleSettingHighlightmode}>
        <TextSegment textSegments={textSegments} />
      </DoubleClickButton>
    );
  };
  const getSafeText = () => {
    if (revealSentenceBreakdown) {
      const vocabBreakDoownWithHexCode = revealSentenceBreakdown
        ? sentence.vocab.map((i, index) => {
            return {
              ...i,
              color: getHexCode(index),
            };
          })
        : null;
      return (
        <Text style={{fontSize: 20}}>
          {vocabBreakDoownWithHexCode.map((nestedSegment, index) => {
            const isLast = vocabBreakDoownWithHexCode.length === index + 1;

            return (
              <Text key={index} style={{color: nestedSegment.color}}>
                {nestedSegment.surfaceForm}
                {!isLast && ' '}
              </Text>
            );
          })}
        </Text>
      );
    } else if (!showAllMatchedWordsState) {
      return getSafeTextDefault(sentence.targetLang);
    }

    const wordsInOverlapCheck = checkOverlap(matchedWordListState);
    return (
      <DoubleClickButton
        onLongPress={handleShowAllMatchedWords}
        onPress={handleSettingHighlightmode}>
        <TextSegmentContainer
          textSegments={textSegments}
          wordsInOverlapCheck={wordsInOverlapCheck}
          matchedWordListState={matchedWordListState}
        />
      </DoubleClickButton>
    );
  };

  if (hideAllTogetherState) {
    return null;
  }
  if (isCollapsingState) {
    return <FlashCardLoadingSpinner />;
  }

  const thisIsPlaying =
    indexNum === selectedIndexState && isLoaded && isPlaying;

  return (
    <View>
      <DifficultSentenceTextContainer
        targetLang={sentence.targetLang}
        previousSentence={sentence.previousSentence}
        baseLang={sentence.baseLang}
        sentenceId={sentence.id}
        safeTextFunc={getSafeText}
        saveWordFirebase={saveWordFirebase}
        isHighlightMode={isHighlightMode}
        setHighlightMode={setHighlightMode}
        handleQuickGoogleTranslate={() => {}}
        notes={sentence.notes}
      />
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
          style={{
            backgroundColor: isThisAudioPlayingInRange
              ? 'yellow'
              : 'transparent',
          }}
        />
        {isDueState ? (
          <View
            style={{
              alignSelf: 'center',
            }}>
            <SRSTogglesScaled
              handleNextReview={handleNextReview}
              againText={againText}
              hardText={hardText}
              goodText={goodText}
              easyText={easyText}
              quickDeleteFunc={handleDeleteContent}
              willBeFollowedByDeletion={isScheduledForDeletion}
            />
          </View>
        ) : (
          <View style={{alignSelf: 'center'}}>
            <Text style={DefaultTheme.fonts.bodyMedium}>Due in X</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const DifficultSentencesGrandSentenceContainer = ({
  displayedStudyItems,
  languageSelectedState,
  updateSentenceData,
}) => {
  const [selectedIndexState, setSelectedIndexState] = useState(0);

  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isTriggered, setIsTriggered] = useState(false);

  const {pureWords} = useData();

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: pureWords,
  });

  const soundRef = useRef();

  useEffect(() => {
    setSelectedIndexState(0);
  }, [displayedStudyItems.length]);

  const topic = displayedStudyItems[0].topic;
  const generalTopic = displayedStudyItems[0].generalTopic;
  const url = getFirebaseAudioURL(generalTopic, languageSelectedState);
  // const sentenceData = displayedStudyItems[selectedIndexState];

  const {loadFile, filePath} = useMP3File(topic);
  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
    setIsPlaying,
  });

  const stopAudioOnUnmount = () => {
    if (isPlaying && soundRef?.current) {
      soundRef?.current.stop(() => {
        setIsPlaying(false);
      });
    }
  };
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
        {displayedStudyItems.map((sentence, index) => {
          return (
            <NestedSentence
              key={index}
              indexNum={index}
              setSelectedIndexState={setSelectedIndexState}
              selectedIndexState={selectedIndexState}
              isLoaded={isLoaded}
              isPlaying={isPlaying}
              sentence={sentence}
              underlineWordsInSentence={underlineWordsInSentence}
              updateSentenceData={updateSentenceData}
              stopAudioOnUnmount={stopAudioOnUnmount}
              playThisSnippet={playThisSnippet}
              currentTimeState={currentTimeState}
            />
          );
        })}
      </View>
    </View>
  );
};

export default DifficultSentencesGrandSentenceContainer;
