import React, {useEffect, useState} from 'react';
import useSnippetManageAudioStop from '../../hooks/useSnippetManageAudioStop';
import {SnippetHandlersDifficultSentence} from '../MiniSnippetTimeChangeHandlers';
import useMainAudioControls from '../../hooks/useMainAudioControls';
import useNewSnippetControls from '../../hooks/useNewSnippetControls';

const hasBeenSnippedFromCollectiveURL = snippet => {
  const snippetURL = snippet.url;
  return snippetURL.includes(snippet.topicName);
};
const DifficultSentenceSnippet = ({
  soundRef,
  currentTimeState,
  snippet,
  masterAudio,
  setMasterAudio,
  index,
  addSnippet,
  removeSnippet,
  setMiniSnippets,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [adjustableStartTime, setAdjustableStartTime] = useState(undefined);
  const [adjustableDuration, setAdjustableDuration] = useState(4);

  const soundDuration = soundRef.current._duration;
  const isSaved = snippet?.saved;

  const isFromUnifiedURL = hasBeenSnippedFromCollectiveURL(snippet);

  const getStartTime = () => {
    if (isFromUnifiedURL && snippet.startAt) {
      return snippet.pointInAudio - snippet.startAt;
    }
    return snippet.pointInAudio;
  };

  const isSavedAndOutsideOfBoundary =
    isSaved && adjustableStartTime && adjustableStartTime > soundDuration;

  useEffect(() => {
    setAdjustableStartTime(getStartTime());
  }, []);

  useEffect(() => {
    if (masterAudio && isPlaying) {
      setMasterAudio(false);
    }
  }, [masterAudio, setMasterAudio, isPlaying]);

  const handleSaveSnippet = async () => {
    const formattedSnippet = {
      ...snippet,
      pointOfAudioOnClick: undefined,
      endAt: undefined,
      pointInAudio: adjustableStartTime,
      duration: adjustableDuration,
    };
    const addSnippetRes = await addSnippet(formattedSnippet);
    if (addSnippetRes) {
      setMiniSnippets(prev =>
        prev.map(snippetData => {
          if (snippetData.id === addSnippetRes.id) {
            return {...addSnippetRes, saved: true};
          }
          return snippetData;
        }),
      );
    }
  };

  const handleRemoveFromTempSnippets = successfullyRemovedId => {
    setMiniSnippets(prev =>
      prev.filter(snippetData => snippetData.id !== successfullyRemovedId),
    );
  };

  const handleRemoveSnippet = async () => {
    const successfullyRemovedId = await removeSnippet({
      snippetId: snippet.id,
      sentenceId: snippet.sentenceId,
    });
    if (successfullyRemovedId) {
      handleRemoveFromTempSnippets(successfullyRemovedId);
    }
  };

  const {handleSetEarlierTime, handleSetDuration} = useNewSnippetControls({
    adjustableStartTime,
    adjustableDuration,
    setAdjustableStartTime,
    setAdjustableDuration,
    snippetEndAtLimit: soundDuration,
    snippetStartAtLimit: 0,
  });

  const {playSound, pauseSound} = useMainAudioControls({
    soundRef,
    isPlaying,
    setIsPlaying,
    isSnippet: true,
    startTime: isSaved ? getStartTime() : adjustableStartTime,
  });

  useSnippetManageAudioStop({
    soundRef,
    isPlaying,
    setIsPlaying,
    startTime: isSaved ? getStartTime() : adjustableStartTime,
    duration: isSaved ? snippet.duration : adjustableDuration,
    currentTime: currentTimeState,
  });

  return (
    <SnippetHandlersDifficultSentence
      handleSetEarlierTime={handleSetEarlierTime}
      handleSaveSnippet={handleSaveSnippet}
      handleRemoveSnippet={handleRemoveSnippet}
      handleRemoveFromTempSnippets={() =>
        handleRemoveFromTempSnippets(snippet.id)
      }
      adjustableDuration={isSaved ? snippet.duration : adjustableDuration}
      handleSetDuration={handleSetDuration}
      adjustableStartTime={adjustableStartTime}
      playSound={playSound}
      pauseSound={pauseSound}
      isPlaying={isPlaying}
      indexList={index}
      isSaved={isSaved}
      isSavedAndOutsideOfBoundary={isSavedAndOutsideOfBoundary}
    />
  );
};

export default DifficultSentenceSnippet;
