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
import ProgressBarComponent from './Progress';
import {generateRandomId} from '../utils/generate-random-id';
import useSnippetControls from '../hooks/useSnippetControls';
import {MiniSnippetTimeChangeHandlers} from './Snippet/SnippetTimeChangeHandlers';
import useSnippetManageAudioStop from '../hooks/useSnippetManageAudioStop';

const ThisSnippetContainer = ({
  soundRef,
  setCurrentTimeState,
  currentTimeState,
  snippet,
  url,
  masterAudio,
  setMasterAudio,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [adjustableStartTime, setAdjustableStartTime] = useState(
    snippet.pointInAudio,
  );
  const [adjustableDuration, setAdjustableDuration] = useState(4);

  const soundDuration = soundRef.current._duration;
  const isInDB = false;

  useEffect(() => {
    if (masterAudio && isPlaying) {
      setMasterAudio(false);
    }
  }, [masterAudio, setMasterAudio, isPlaying]);

  const {
    // handleDelete,
    // handleAddingSnippet,
    // handleRemoveSnippet,
    handleSetEarlierTime,
    handleSetDuration,
  } = useSnippetControls({
    adjustableStartTime,
    adjustableDuration,
    setAdjustableStartTime,
    setAdjustableDuration,
    snippetEndAtLimit: soundDuration,
    snippetStartAtLimit: 0,
    deleteSnippet: () => {},
    addSnippet: () => {},
    removeSnippet: () => {},
    snippet,
  });

  const {playSound, pauseSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName: snippet.topicName,
    isSnippet: true,
    startTime: isInDB ? pointInAudio : adjustableStartTime,
    setCurrentTime: setCurrentTimeState,
  });

  useSnippetManageAudioStop({
    soundRef,
    isPlaying,
    setIsPlaying,
    startTime: isInDB ? pointInAudio : adjustableStartTime,
    duration: isInDB ? durationInDB : adjustableDuration,
    currentTime: currentTimeState,
  });

  return (
    <MiniSnippetTimeChangeHandlers
      handleSetEarlierTime={handleSetEarlierTime}
      adjustableDuration={adjustableDuration}
      handleSetDuration={handleSetDuration}
      adjustableStartTime={adjustableStartTime}
      playSound={playSound}
      pauseSound={pauseSound}
      isPlaying={isPlaying}
    />
  );
};

export const SoundWidget = ({
  soundRef,
  url,
  topicName,
  handleSnippet,
  sentence,
  isPlaying,
  setIsPlaying,
  currentTimeState,
  setCurrentTimeState,
  masterAudio,
  setMasterAudio,
}) => {
  const jumpAudioValue = 2;
  const soundDuration = soundRef.current._duration;

  // const pointInAudio = sentence?.pointInAudio;
  // const snippetStartAtLimit = sentence?.startAt;
  // const snippetEndAtLimit = sentence?.endAt;
  // const pointOfAudioOnClick = sentence?.pointOfAudioOnClick;

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

  const handleSnippetFunc = () => {
    handleSnippet(currentTimeState);
    pauseSound();
  };

  const {playSound, pauseSound, forwardSound, rewindSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
    rewindForwardInterval: jumpAudioValue,
  });

  return (
    <View>
      <ProgressBarComponent
        endTime={soundDuration}
        progress={currentTimeState / soundDuration}
        time={currentTimeState.toFixed(2)}
        noMargin
        noPadding
      />
      <SoundSmallSize
        soundRef={soundRef}
        isPlaying={isPlaying}
        playSound={playSound}
        pauseSound={pauseSound}
        rewindSound={() => rewindSound(jumpAudioValue)}
        forwardSound={() => forwardSound(jumpAudioValue)}
        jumpAudioValue={jumpAudioValue}
        handleSnippet={handleSnippetFunc}
      />
    </View>
  );
};

const DifficultSentenceWidget = ({
  sentence,
  todayDateObj,
  updateSentenceData,
  isLastEl,
  dueStatus,
}) => {
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [futureDaysState, setFutureDaysState] = useState(3);
  const [showReviewSettings, setShowReviewSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [miniSnippets, setMiniSnippets] = useState([]);

  const id = sentence.id;
  const topic = sentence.topic;
  const isCore = sentence?.isCore;
  const baseLang = sentence.baseLang;
  const targetLang = sentence.targetLang;
  const nextReview = sentence?.nextReview;
  const isAdhoc = sentence?.isAdhoc;
  const hasBeenReviewed = sentence?.reviewHistory?.length > 0;
  const soundRef = useRef();

  const handleSnippet = currentTime => {
    const snippetId = topic + '-' + generateRandomId();
    const itemToSave = {
      id: snippetId,
      sentenceId: id,
      pointInAudio: currentTime,
      isIsolated: true,
      pointOfAudioOnClick: currentTime,
      url,
      topicName: topic,
    };
    setMiniSnippets(prev => [...prev, itemToSave]);
  };

  const updateExistingReviewHistory = () => {
    return [...sentence?.reviewHistory, new Date()];
  };

  const setNextReviewDate = () => {
    const reviewNotNeeded = futureDaysState === 0;
    if (reviewNotNeeded) {
      updateSentenceData({
        isAdhoc,
        topicName: topic,
        sentenceId: id,
        fieldToUpdate: {
          reviewHistory: [],
          nextReview: null,
        },
      });
    } else {
      updateSentenceData({
        isAdhoc,
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
    setShowReviewSettings(false);
  };

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
        <SoundWidget
          soundRef={soundRef}
          url={url}
          topicName={topic}
          handleSnippet={handleSnippet}
          sentence={sentence}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentTimeState={currentTimeState}
          setCurrentTimeState={setCurrentTimeState}
        />
      ) : (
        <View>
          <TouchableOpacity onPress={handleLoad}>
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
      {miniSnippets?.length > 0 ? (
        <ThisSnippetContainer
          soundRef={soundRef}
          snippet={miniSnippets[0]}
          setCurrentTimeState={setCurrentTimeState}
          currentTimeState={currentTimeState}
          masterAudio={isPlaying}
          setMasterAudio={setIsPlaying}
          url={url}
        />
      ) : null}
    </View>
  );
};

export default DifficultSentenceWidget;
