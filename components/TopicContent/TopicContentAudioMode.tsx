import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ScrollView, Dimensions} from 'react-native';
import DisplaySettings from '../DisplaySettings';
import useAudioTextSync from '../../hooks/useAudioTextSync';
import BilingualTextContainer from '../BilingualTextContainer';
import ReviewSection from '../ReviewSection';
import useTrackCurrentTimeState from '../../hooks/useTrackCurrentTimeState';
import TopicContentAudioSection from '../TopicContentAudioSection';
import AnimatedModal from '../AnimatedModal';
import useTopicContentAudio from './context/useTopicContentAudio';
import {generateRandomId} from '../../utils/generate-random-id';
import {TopicContentSnippetsProvider} from './context/TopicContentSnippetsProvider';
import useContentScreen from '../../screens/Content/useContentScreen';
import WordModalDifficultSentence from '../WordModalDifficultSentence';

const {height} = Dimensions?.get('window');

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
  handleVideoMode,
  secondsToSentencesMapState,
  highlightTargetTextState,
  formattedData,
  hasContentToReview,
  url,
  handleOpenGoogle,
  dueSentences,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [engMaster, setEngMaster] = useState(true);
  const [showOnlyReviewState, setShowOnlyReviewState] = useState(false);
  const [showReviewSectionState, setShowReviewSectionState] = useState(false);
  const [selectedSnippetsState, setSelectedSnippetsState] = useState([]);
  const [isAutoScrollingMode, setisAutoScrollingMode] = useState(true);

  const scrollViewRef = useRef(null);

  const {
    enableScroll,
    selectedDueCardState,
    setSelectedDueCardState,
    handleDeleteWord,
  } = useContentScreen();

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

  const {reviewHistory, nextReview, isCore, contentIndex, hasVideo, content} =
    loadedContent;

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

  useEffect(() => {
    if (dueSentences) {
      setShowOnlyReviewState(true);
    }
  }, [dueSentences]);

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
            handleIsCore={handleIsCore}
            isCore={isCore}
          />
        </AnimatedModal>
      )}
      <View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{
            maxHeight: height * 0.8,
          }}
          ref={scrollViewRef}
          scrollEnabled={enableScroll}>
          <View style={{alignSelf: 'center'}}>
            <Text>{topicName}</Text>
          </View>
          <DisplaySettings
            engMaster={engMaster}
            setEngMaster={setEngMaster}
            isVideoModeState={isVideoModeState}
            hasVideo={hasVideo}
            handleVideoMode={handleVideoMode}
            isAutoScrollingMode={isAutoScrollingMode}
            setisAutoScrollingMode={setisAutoScrollingMode}
            showOnlyReviewState={showOnlyReviewState}
            setShowOnlyReviewState={setShowOnlyReviewState}
            dueSentences={dueSentences}
          />
          {selectedDueCardState && (
            <WordModalDifficultSentence
              visible={selectedDueCardState}
              onClose={() => setSelectedDueCardState(null)}
              deleteWord={() => handleDeleteWord(selectedDueCardState)}
              updateWordData={() => {}}
            />
          )}
          <BilingualTextContainer
            formattedData={formattedData}
            playFromThisSentence={handlePlayFromThisSentence}
            engMaster={engMaster}
            isPlaying={isPlaying}
            pauseSound={pauseSound}
            snippetsLocalAndDb={selectedSnippetsState}
            masterPlay={masterPlay}
            topicName={topicName}
            updateSentenceData={updateSentenceData}
            currentTimeState={currentTimeState}
            playSound={playFromHere}
            highlightTargetTextState={highlightTargetTextState}
            contentIndex={contentIndex}
            breakdownSentenceFunc={breakdownSentenceFunc}
            handleOpenGoogle={handleOpenGoogle}
            scrollViewRef={scrollViewRef}
            isAutoScrollingMode={isAutoScrollingMode}
            dueSentences={dueSentences}
            showOnlyReviewState={showOnlyReviewState}
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
