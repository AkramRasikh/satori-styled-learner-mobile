import React, {useRef, useState} from 'react';
import {View, Text, ScrollView, Dimensions} from 'react-native';
import {getFirebaseVideoURL} from '../../hooks/useGetCombinedAudioData';
import DisplaySettings from '../DisplaySettings';
import BilingualTextContainer from '../BilingualTextContainer';
import ReviewSection from '../ReviewSection';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import AudioToggles from '../AudioToggles';
import VideoPlayer from '../VideoPlayer';
import {getGeneralTopicName} from '../../utils/get-general-topic-name';
import AnimatedModal from '../AnimatedModal';
import useTopicContentVideo from './context/useTopicContentVideo';
import useContentScreen from '../../screens/Content/useContentScreen';
import WordModalDifficultSentence from '../WordModalDifficultSentence';

const {height} = Dimensions?.get('window');

const TopicContentVideoMode = ({
  topicName,
  updateTopicMetaData,
  updateSentenceData,
  loadedContent,
  breakdownSentenceFunc,
  handleVideoMode,
  handleIsCore,
  handleBulkReviews,
  highlightTargetTextState,
  secondsToSentencesMapState,
  hasContentToReview,
  handleOpenGoogle,
}) => {
  const [engMaster, setEngMaster] = useState(true);
  const [showReviewSectionState, setShowReviewSectionState] = useState(false);
  const [isAutoScrollingMode, setisAutoScrollingMode] = useState(true);
  const scrollViewRef = useRef(null);

  const {languageSelectedState} = useLanguageSelector();
  const {
    enableScroll,
    selectedDueCardState,
    setSelectedDueCardState,
    handleDeleteWord,
  } = useContentScreen();

  const {
    currentVideoTimeState,
    videoRef,
    isVideoPlaying,
    progress,
    seekHandler,
    handlePlayFromThisSentence,
    handleVideoPause,
    setCurrentVideoTimeState,
    setVideoDurationState,
    playVideo,
  } = useTopicContentVideo();

  const {reviewHistory, nextReview, isCore, contentIndex, hasVideo, content} =
    loadedContent;

  const masterPlay =
    currentVideoTimeState &&
    secondsToSentencesMapState?.length > 0 &&
    secondsToSentencesMapState[Math.floor(currentVideoTimeState)];

  const videoUrl = hasVideo
    ? getFirebaseVideoURL(getGeneralTopicName(topicName), languageSelectedState)
    : '';

  return (
    <>
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
        <View>
          <VideoPlayer
            url={videoUrl}
            videoRef={videoRef}
            isPlaying={isVideoPlaying}
            onProgressHandler={setCurrentVideoTimeState}
            setVideoDuration={setVideoDurationState}
          />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={{
              maxHeight: height * 0.58,
              paddingVertical: 5,
            }}
            ref={scrollViewRef}
            scrollEnabled={enableScroll}>
            <View style={{alignSelf: 'center'}}>
              <Text>{topicName}</Text>
            </View>
            <DisplaySettings
              engMaster={engMaster}
              setEngMaster={setEngMaster}
              hasVideo={hasVideo}
              handleVideoMode={handleVideoMode}
              isAutoScrollingMode={isAutoScrollingMode}
              setisAutoScrollingMode={setisAutoScrollingMode}
              isVideoModeState
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
              formattedData={content}
              playFromThisSentence={handlePlayFromThisSentence}
              engMaster={engMaster}
              isPlaying={isVideoPlaying}
              pauseSound={handleVideoPause}
              masterPlay={masterPlay}
              topicName={topicName}
              updateSentenceData={updateSentenceData}
              currentTimeState={currentVideoTimeState}
              playSound={playVideo}
              highlightTargetTextState={highlightTargetTextState}
              contentIndex={contentIndex}
              breakdownSentenceFunc={breakdownSentenceFunc}
              handleOpenGoogle={handleOpenGoogle}
              scrollViewRef={scrollViewRef}
              isAutoScrollingMode={isAutoScrollingMode}
            />
          </ScrollView>
          <AudioToggles
            isPlaying={isVideoPlaying}
            playSound={playVideo}
            seekHandler={seekHandler}
            progress={progress}
            setShowReviewSectionState={setShowReviewSectionState}
          />
        </View>
      </View>
    </>
  );
};

export default TopicContentVideoMode;
