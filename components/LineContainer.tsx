import React, {useRef} from 'react';
import {View, Text, Dimensions} from 'react-native';
import SatoriLine from './SatoriLine';
import {useEffect, useState} from 'react';
import {SnippetHandlersDifficultSentence} from './MiniSnippetTimeChangeHandlers';
import useSnippetControls from '../hooks/useSnippetControls';
import useTopicContent from './TopicContent/context/useTopicContentSnippets';

const OneSnippetContainer = ({
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
    useTopicContent();

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
  snippetsLocalAndDb,
  masterPlay,
  highlightMode,
  setHighlightMode,
  topicName,
  updateSentenceData,
  currentTimeState,
  playSound,
  highlightTargetTextState,
  contentIndex,
  breakdownSentenceFunc,
}) => {
  const {width} = Dimensions.get('window');
  const lineContainerRef = useRef(0);
  lineContainerRef.current = lineContainerRef.current + 1;

  console.log('## lineContainerRef', lineContainerRef);
  return (
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

          const isHighlightedText = highlightTargetTextState === id;
          const highlightedTextState = isHighlightedText
            ? 'orange'
            : focusThisSentence
            ? 'yellow'
            : 'transparent';

          return (
            <View
              style={{
                marginBottom: 10,
                paddingTop: firstEl ? 10 : 0,
              }}
              key={id}>
              <View
                style={{
                  backgroundColor: highlightedTextState,
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
                  textWidth={width * 0.9}
                  setHighlightMode={setHighlightMode}
                  topicName={topicName}
                  updateSentenceData={updateSentenceData}
                  contentIndex={contentIndex}
                  breakdownSentenceFunc={breakdownSentenceFunc}
                />
              </View>

              {thisSnippets?.map((snippetData, index) => {
                return (
                  <OneSnippetContainer
                    key={index}
                    snippet={snippetData}
                    playSound={playSound}
                    pauseSound={pauseSound}
                    isPlaying={isPlaying}
                    currentTimeState={currentTimeState}
                    indexList={index}
                  />
                );
              })}
            </View>
          );
        })}
      </Text>
    </View>
  );
};

export default LineContainer;
