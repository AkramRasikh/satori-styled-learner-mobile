import {Text, TouchableOpacity, View} from 'react-native';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import {useRef, useState} from 'react';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import useSoundHook from '../hooks/useSoundHook';
import DifficultSentenceContent from './DifficultSentenceContent';
import SoundSmallSize from './SoundSmallSize';
import SatoriLineReviewSection from './SatoriLineReviewSection';
import {setFutureReviewDate} from './ReviewSection';

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
        nextReview={nextReview}
        setShowReviewSettings={setShowReviewSettings}
        todayDateObj={todayDateObj}
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
