import React, {View, Text} from 'react-native';
import SatoriLine from './SatoriLine';
import {useEffect, useState} from 'react';
import MiniSnippetTimeChangeHandlers from './MiniSnippetTimeChangeHandlers';
import useSnippetControls from '../hooks/useSnippetControls';

const OneSnippetContainer = ({
  snippet,
  deleteSnippet,
  addSnippet,
  removeSnippet,
  playSound,
  pauseSound,
  isPlaying,
  indexList,
  currentTimeState,
  handleRemoveFromTempSnippets,
  handleAddSnippet,
}) => {
  const [snipperIsPlayingState, setSnipperIsPlayingState] = useState(false);
  const [adjustableStartTime, setAdjustableStartTime] = useState();
  const [adjustableDuration, setAdjustableDuration] = useState(4);

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
      handleRemoveFromTempSnippets(id);
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
    deleteSnippet,
    addSnippet,
    removeSnippet,
    snippet,
  });

  return (
    <View
      style={{
        backgroundColor: snipperIsPlayingState ? 'yellow' : 'transparent',
      }}>
      <MiniSnippetTimeChangeHandlers
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

const LineContainer = ({
  formattedData,
  playFromThisSentence,
  englishOnly,
  highlightedIndices,
  setHighlightedIndices,
  saveWordFirebase,
  engMaster,
  isPlaying,
  pauseSound,
  width,
  snippetsLocalAndDb,
  masterPlay,
  highlightMode,
  setHighlightMode,
  onLongPress,
  topicName,
  updateSentenceData,
  currentTimeState,
  addSnippet,
  removeSnippet,
  deleteSnippet,
  setMiniSnippets,
  playSound,
  handleAddSnippet,
}) => {
  const handleRemoveFromTempSnippets = snippetId => {
    setMiniSnippets(prev =>
      prev.filter(snippetDataState => snippetDataState.id !== snippetId),
    );
  };
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        <Text style={{fontSize: 20}}>
          {formattedData?.map((topicSentence, index) => {
            if (topicSentence.targetLang === '') return null;
            const id = topicSentence.id;
            const focusThisSentence = id === masterPlay;
            const firstEl = index === 0;

            const thisSnippets = snippetsLocalAndDb?.filter(
              item => id === item.sentenceId,
            );

            return (
              <View
                style={{
                  width: width * 0.9,
                  marginBottom: 10,
                  paddingTop: firstEl ? 10 : 0,
                }}
                key={id}>
                <Text
                  style={{
                    backgroundColor: focusThisSentence
                      ? 'yellow'
                      : 'transparent',
                    fontSize: 20,
                  }}>
                  <SatoriLine
                    id={id}
                    sentenceIndex={index}
                    focusThisSentence={focusThisSentence}
                    topicSentence={topicSentence}
                    playFromThisSentence={playFromThisSentence}
                    englishOnly={englishOnly}
                    highlightMode={highlightMode}
                    highlightedIndices={highlightedIndices}
                    setHighlightedIndices={setHighlightedIndices}
                    saveWordFirebase={saveWordFirebase}
                    engMaster={engMaster}
                    isPlaying={isPlaying}
                    pauseSound={pauseSound}
                    safeText={topicSentence.safeText}
                    textWidth={width * 0.9}
                    setHighlightMode={setHighlightMode}
                    onLongPress={onLongPress}
                    topicName={topicName}
                    updateSentenceData={updateSentenceData}
                  />
                </Text>

                {thisSnippets?.map((snippetData, index) => {
                  return (
                    <OneSnippetContainer
                      key={index}
                      snippet={snippetData}
                      deleteSnippet={deleteSnippet}
                      addSnippet={addSnippet}
                      removeSnippet={removeSnippet}
                      playSound={playSound}
                      pauseSound={pauseSound}
                      isPlaying={isPlaying}
                      currentTimeState={currentTimeState}
                      indexList={index}
                      handleRemoveFromTempSnippets={
                        handleRemoveFromTempSnippets
                      }
                      handleAddSnippet={handleAddSnippet}
                    />
                  );
                })}
              </View>
            );
          })}
        </Text>
      </View>
    </View>
  );
};

export default LineContainer;
