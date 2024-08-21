import {Text, TouchableOpacity, View} from 'react-native';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import {useEffect, useRef, useState} from 'react';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import useSoundHook from '../hooks/useSoundHook';
import DifficultSentenceContent from './DifficultSentenceContent';
import SoundSmallSize from './SoundSmallSize';
import SatoriLineReviewSection from './SatoriLineReviewSection';
import {setFutureReviewDate} from './ReviewSection';
import {getDueDateText} from '../utils/get-date-due-status';
import useMP3File from '../hooks/useMP3File';

const SoundWidget = ({soundRef, url, topicName}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const jumpAudioValue = 2;
  const {playSound, pauseSound, forwardSound, rewindSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
    rewindForwardInterval: jumpAudioValue,
  });

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
  dueStatus,
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

  const {loadFile, filePath} = useMP3File(id);

  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
  });

  useEffect(() => {
    if (filePath) {
      triggerLoadURL();
    }
  }, [filePath]);

  const handleLoad = () => {
    loadFile(id, url);
  };

  const {dueColorState, text} = getDueDateText(dueStatus);

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
        dueText={text}
        dueColorState={dueColorState}
      />
      {isLoaded ? (
        <SoundWidget soundRef={soundRef} url={url} topicName={topic} />
      ) : (
        <View>
          <TouchableOpacity onPress={handleLoad}>
            {/* <TouchableOpacity onPress={loadFiletriggerLoadURL}> */}
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
