import React from 'react';
import {View} from 'react-native';
import {useEffect, useState} from 'react';
import {SnippetHandlersDifficultSentence} from './MiniSnippetTimeChangeHandlers';
import useSnippetControls from '../hooks/useSnippetControls';
import useTopicContentSnippets from './TopicContent/context/useTopicContentSnippets';

const BilingualSnippetContainer = ({
  snippet,
  playSound,
  pauseSound,
  isPlaying,
  indexList,
  currentTimeState,
}) => {
  const [snipperIsPlayingState, setSnipperIsPlayingState] = useState(false);
  const [adjustableStartTime, setAdjustableStartTime] = useState();
  const [adjustableDuration, setAdjustableDuration] = useState(4);

  const {handleAddSnippet, deleteSnippet, setSelectedSnippetsState} =
    useTopicContentSnippets();

  const id = snippet.id;
  const sentenceId = snippet.sentenceId;
  const pointInAudio = snippet.pointInAudio;
  const snippetStartAtLimit = snippet?.startAt;
  const snippetEndAtLimit = snippet?.endAt;
  const pointInAudioOnClick = snippet?.pointInAudioOnClick;

  const duration = snippet.duration;
  const isSaved = snippet?.saved;
  const startTime = isSaved ? pointInAudio : adjustableStartTime;

  const currentDuration = isSaved ? duration : adjustableDuration;
  const snippetEndAt = startTime + currentDuration;

  const handleRemoveFromState = () => {
    if (isSaved) {
      deleteSnippet({snippetId: id, sentenceId});
    } else {
      setSelectedSnippetsState(prev =>
        prev.filter(snippetData => snippetData.id !== id),
      );
    }
  };

  const handleAddSnippetFunc = () => {
    const formattedSnippet = {
      id: snippet.id,
      sentenceId: snippet.sentenceId,
      pointInAudio: adjustableStartTime,
      duration: adjustableDuration,
      startAt: snippet.startAt,
      isIsolated: snippet.isIsolated,
      targetLang: snippet.targetLang,
      topicName: snippet.topicName,
      url: snippet.url,
    };
    handleAddSnippet(formattedSnippet);
  };

  const handleThisPlay = () => {
    setSnipperIsPlayingState(true);
    playSound(startTime);
  };

  useEffect(() => {
    if (snipperIsPlayingState) {
      const audioIsInTimeRange =
        startTime <= currentTimeState && currentTimeState <= snippetEndAt;
      if (!audioIsInTimeRange) {
        setSnipperIsPlayingState(false);
        pauseSound();
      }
    }
  }, [
    startTime,
    snippetEndAt,
    currentTimeState,
    snipperIsPlayingState,
    setSnipperIsPlayingState,
    pauseSound,
  ]);

  useEffect(() => {
    if (!adjustableStartTime) {
      setAdjustableStartTime(pointInAudioOnClick);
    }
  }, [adjustableStartTime, pointInAudioOnClick, setAdjustableStartTime]);

  const {handleSetEarlierTime, handleSetDuration} = useSnippetControls({
    adjustableStartTime,
    adjustableDuration,
    setAdjustableStartTime,
    setAdjustableDuration,
    snippetEndAtLimit,
    snippetStartAtLimit,
    snippet,
    deleteSnippet: () => {},
    addSnippet: () => {},
  });

  return (
    <View
      style={{
        backgroundColor: snipperIsPlayingState ? 'yellow' : 'transparent',
      }}>
      <SnippetHandlersDifficultSentence
        handleSetEarlierTime={handleSetEarlierTime}
        handleSaveSnippet={handleAddSnippetFunc}
        handleRemoveSnippet={handleRemoveFromState}
        handleRemoveFromTempSnippets={handleRemoveFromState} // directly from state
        adjustableDuration={currentDuration}
        handleSetDuration={handleSetDuration}
        adjustableStartTime={startTime}
        playSound={handleThisPlay}
        pauseSound={pauseSound}
        isPlaying={isPlaying}
        indexList={indexList}
        isSaved={isSaved}
      />
    </View>
  );
};

export default BilingualSnippetContainer;
