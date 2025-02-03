import {useEffect, useState} from 'react';
import useSoundHook from '../../hooks/useSoundHook';
import useSnippetControls from '../../hooks/useSnippetControls';
import useSnippetManageAudioStop from '../../hooks/useSnippetManageAudioStop';
import MiniSnippetTimeChangeHandlers from '../MiniSnippetTimeChangeHandlers';

const hasBeenSnippedFromCollectiveURL = snippet => {
  const snippetURL = snippet.url;
  return snippetURL.includes(snippet.topicName);
};
const ThisSnippetContainer = ({
  soundRef,
  setCurrentTimeState,
  currentTimeState,
  snippet,
  url,
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

  const {handleSetEarlierTime, handleSetDuration} = useSnippetControls({
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
    startTime: isSaved ? getStartTime() : adjustableStartTime,
    setCurrentTime: setCurrentTimeState,
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
    <MiniSnippetTimeChangeHandlers
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
const DifficultSentenceSnippets = ({
  isLoaded,
  soundRef,
  snippetsLocalAndDb,
  setCurrentTimeState,
  currentTimeState,
  isPlaying,
  setIsPlaying,
  addSnippet,
  removeSnippet,
  setMiniSnippets,
  url,
}) => {
  return isLoaded && snippetsLocalAndDb?.length > 0
    ? snippetsLocalAndDb?.map((snippetData, index) => {
        return (
          <ThisSnippetContainer
            key={snippetData.id}
            index={index}
            soundRef={soundRef}
            snippet={snippetData}
            setCurrentTimeState={setCurrentTimeState}
            currentTimeState={currentTimeState}
            masterAudio={isPlaying}
            setMasterAudio={setIsPlaying}
            addSnippet={addSnippet}
            removeSnippet={removeSnippet}
            setMiniSnippets={setMiniSnippets}
            url={url}
          />
        );
      })
    : null;
};

export default DifficultSentenceSnippets;
