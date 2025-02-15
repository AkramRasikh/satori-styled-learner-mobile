import React, {useState} from 'react';
import {View, Text, ScrollView, Dimensions} from 'react-native';
import DisplaySettings from '../DisplaySettings';
import useAudioTextSync from '../../hooks/useAudioTextSync';
import LineContainer from '../LineContainer';
import ReviewSection from '../ReviewSection';
import useTrackCurrentTimeState from '../../hooks/useTrackCurrentTimeState';
import TopicContentAudioSection from '../TopicContentAudioSection';
import useData from '../../context/Data/useData';
import AnimatedModal from '../AnimatedModal';
import useTopicContentAudio from './context/useTopicContentAudio';
import {generateRandomId} from '../../utils/generate-random-id';
import {TopicContentSnippetsProvider} from './context/TopicContentSnippetsProvider';

const timeDataWithinSnippet = (thisItem, currentTimeState) => {
  const pointInAudioInSnippet = currentTimeState - thisItem.startAt;
  return pointInAudioInSnippet;
};

const TopicContentAudioMode = ({
  topicName,
  updateTopicMetaData,
  updateSentenceData,
  loadedContent,
  breakdownSentenceFunc,
  handleBulkReviews,
  handleIsCore,
  content,
  handleVideoMode,
  secondsToSentencesMapState,
  highlightTargetTextState,
  formattedData,
  hasContentToReview,
  url,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [englishOnly, setEnglishOnly] = useState(false);
  const [engMaster, setEngMaster] = useState(true);
  const [highlightMode, setHighlightMode] = useState(false);
  const [showReviewSectionState, setShowReviewSectionState] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [selectedSnippetsState, setSelectedSnippetsState] = useState([]);

  const {saveWordFirebase} = useData();

  const {
    handlePlayFromThisSentence,
    playFromHere,
    currentTimeState,
    setCurrentTimeState,
    soundRef,
    isPlaying,
    isVideoModeState,
    pauseSound,
    setIsPlaying,
  } = useTopicContentAudio();

  const {reviewHistory, nextReview, isCore, contentIndex, hasVideo} =
    loadedContent;

  const {height} = Dimensions?.get('window');
  const soundDuration = soundRef?.current?._duration || 0;

  const initSnippet = () => {
    const isText = true;
    const id = topicName + '-' + generateRandomId();
    const thisItem = content.find(item => item.id === masterPlay);
    const targetLang = thisItem?.targetLang;
    if (!targetLang) {
      return null;
    }
    const itemToSave = {
      id,
      sentenceId: masterPlay,
      pointInAudio: isText
        ? timeDataWithinSnippet(thisItem, currentTimeState)
        : currentTimeState,
      isIsolated: isText ? true : false,
      endAt: thisItem.endAt,
      startAt: thisItem.startAt,
      url,
      pointInAudioOnClick: currentTimeState,
      targetLang,
      topicName,
    };
    setSelectedSnippetsState(prev => [...prev, itemToSave]);
    pauseSound();
    setIsPlaying(false);
  };

  useTrackCurrentTimeState({
    soundRef,
    setCurrentTimeState,
  });

  useAudioTextSync({
    currentTimeState,
    setMasterPlay,
    secondsToSentencesMapState,
  });

  return (
    <TopicContentSnippetsProvider
      topicName={topicName}
      loadedContent={loadedContent}
      selectedSnippetsState={selectedSnippetsState}
      setSelectedSnippetsState={setSelectedSnippetsState}>
      {showReviewSectionState && (
        <AnimatedModal visible onClose={() => setShowReviewSectionState(false)}>
          <ReviewSection
            topicName={topicName}
            reviewHistory={reviewHistory}
            nextReview={nextReview}
            updateTopicMetaData={updateTopicMetaData}
            handleBulkReviews={handleBulkReviews}
            hasSomeReviewedSentences={hasContentToReview}
          />
        </AnimatedModal>
      )}
      <View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{
            maxHeight: height * 0.8,
          }}>
          <View style={{alignSelf: 'center'}}>
            <Text>{topicName}</Text>
          </View>
          <DisplaySettings
            englishOnly={englishOnly}
            setEnglishOnly={setEnglishOnly}
            engMaster={engMaster}
            setEngMaster={setEngMaster}
            handleIsCore={handleIsCore}
            isCore={isCore}
            isVideoModeState={isVideoModeState}
            hasVideo={hasVideo}
            handleVideoMode={handleVideoMode}
          />
          <LineContainer
            formattedData={formattedData}
            playFromThisSentence={handlePlayFromThisSentence}
            englishOnly={englishOnly}
            highlightedIndices={highlightedIndices}
            setHighlightedIndices={setHighlightedIndices}
            saveWordFirebase={saveWordFirebase}
            engMaster={engMaster}
            isPlaying={isPlaying}
            pauseSound={pauseSound}
            snippetsLocalAndDb={selectedSnippetsState}
            masterPlay={masterPlay}
            highlightMode={highlightMode}
            setHighlightMode={setHighlightMode}
            topicName={topicName}
            updateSentenceData={updateSentenceData}
            currentTimeState={currentTimeState}
            playSound={playFromHere}
            highlightTargetTextState={highlightTargetTextState}
            contentIndex={contentIndex}
            breakdownSentenceFunc={breakdownSentenceFunc}
          />
        </ScrollView>
        <TopicContentAudioSection
          initSnippet={initSnippet}
          soundDuration={soundDuration}
          setShowReviewSectionState={setShowReviewSectionState}
        />
      </View>
    </TopicContentSnippetsProvider>
  );
};

export default TopicContentAudioMode;
