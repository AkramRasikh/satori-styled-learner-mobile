import {Text, TouchableOpacity, View} from 'react-native';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import {useRef, useState} from 'react';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import useSoundHook from '../hooks/useSoundHook';
import DifficultSentenceContent from './DifficultSentenceContent';
import SoundSmallSize from './SoundSmallSize';
import SatoriLineReviewSection from './SatoriLineReviewSection';
import {setFutureReviewDate} from './ReviewSection';
import {isSameDay} from '../utils/check-same-date';

const SoundWidget = ({soundRef, url, topicName}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const {playSound, pauseSound, forwardSound, rewindSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
  });
  const jumpAudioValue = 2;

  return (
    <SoundSmallSize
      soundRef={soundRef}
      isPlaying={isPlaying}
      playSound={playSound}
      pauseSound={pauseSound}
      rewindSound={() => rewindSound(jumpAudioValue)}
      forwardSound={() => forwardSound(jumpAudioValue)}
      jumpAudioValue={jumpAudioValue}
    />
  );
};

const DifficultSentenceWidget = ({
  sentence,
  todayDateObj,
  updateSentenceData,
  isLastEl,
}) => {
  const [futureDaysState, setFutureDaysState] = useState(3);
  const [showReviewSettings, setShowReviewSettings] = useState(false);
  let dueColorState;

  const id = sentence.id;
  const topic = sentence.topic;
  const isCore = sentence?.isCore;
  const baseLang = sentence.baseLang;
  const targetLang = sentence.targetLang;
  const nextReview = sentence?.nextReview;
  const hasBeenReviewed = sentence?.reviewHistory?.length > 0;
  const updateExistingReviewHistory = () => {
    return [...sentence?.reviewHistory, new Date()];
  };
  const setNextReviewDate = () => {
    const reviewNotNeeded = futureDaysState === 0;
    if (reviewNotNeeded) {
      updateSentenceData({
        topicName: topic,
        sentenceId: id,
        fieldToUpdate: {
          reviewHistory: [],
          nextReview: null,
        },
      });
    } else {
      updateSentenceData({
        topicName: topic,
        sentenceId: id,
        fieldToUpdate: {
          reviewHistory: hasBeenReviewed
            ? updateExistingReviewHistory()
            : [new Date()],
          nextReview: setFutureReviewDate(todayDateObj, futureDaysState),
        },
      });
    }
  };

  const soundRef = useRef();
  const url = getFirebaseAudioURL(id);

  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url,
  });

  const thisNextReviewObj = new Date(nextReview);

  const getAdjustedDifferenceInDays = (dateA, dateB) => {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
    const differenceInTime = dateB - dateA; // Difference in milliseconds
    const differenceInDays = Math.floor(
      differenceInTime / oneDayInMilliseconds,
    );

    // Check if the dates are on different calendar days
    const isDifferentCalendarDay =
      dateA.getDate() !== dateB.getDate() ||
      dateA.getMonth() !== dateB.getMonth() ||
      dateA.getFullYear() !== dateB.getFullYear();

    // If dates are on different calendar days, acknowledge it as a full day difference
    if (isDifferentCalendarDay) {
      return differenceInDays + 1;
    }

    return differenceInDays;
  };
  const calculateDueDate = () => {
    if (isSameDay(todayDateObj, thisNextReviewObj)) {
      dueColorState = '#FFBF00';
      return `Due today`;
    }

    const daysDifference = getAdjustedDifferenceInDays(
      todayDateObj,
      thisNextReviewObj,
    );

    if (daysDifference < 0) {
      dueColorState = '#8B0000';
      return `Due ${Math.abs(daysDifference)} days ago`;
    }

    dueColorState = 'green';
    return `Due in ${daysDifference} days`;
  };

  const dueText = calculateDueDate();

  return (
    <View
      key={id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginBottom: 10,
        paddingBottom: isLastEl ? 100 : 0,
      }}>
      <DifficultSentenceContent
        topic={topic}
        isCore={isCore}
        targetLang={targetLang}
        baseLang={baseLang}
        setShowReviewSettings={setShowReviewSettings}
        dueText={dueText}
        dueColorState={dueColorState}
      />
      {isLoaded ? (
        <SoundWidget soundRef={soundRef} url={url} topicName={topic} />
      ) : (
        <View>
          <TouchableOpacity onPress={triggerLoadURL}>
            <Text>Load URL</Text>
          </TouchableOpacity>
        </View>
      )}
      {showReviewSettings ? (
        <SatoriLineReviewSection
          nextReview={nextReview}
          futureDaysState={futureDaysState}
          showReviewSettings={showReviewSettings}
          setFutureDaysState={setFutureDaysState}
          setNextReviewDate={setNextReviewDate}
        />
      ) : null}
    </View>
  );
};

export default DifficultSentenceWidget;
