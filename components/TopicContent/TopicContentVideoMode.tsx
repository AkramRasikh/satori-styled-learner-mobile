import React, {useState} from 'react';
import {View, Text, ScrollView, Dimensions} from 'react-native';
import {getFirebaseVideoURL} from '../../hooks/useGetCombinedAudioData';
import DisplaySettings from '../DisplaySettings';
import LineContainer from '../LineContainer';
import ReviewSection from '../ReviewSection';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import AudioToggles from '../AudioToggles';
import VideoPlayer from '../VideoPlayer';
import useVideoTextSync from '../../hooks/useVideoTextSync';
import useData from '../../context/Data/useData';
import {getGeneralTopicName} from '../../utils/get-general-topic-name';
import AnimatedModal from '../AnimatedModal';
import useTopicContentAudio from './context/useTopicContentAudio';

const TopicContentVideoMode = ({
  topicName,
  updateTopicMetaData,
  updateSentenceData,
  loadedContent,
  breakdownSentenceFunc,
  handleVideoMode,
  handleIsCore,
  handleBulkReviews,
  formattedData,
  highlightTargetTextState,
  secondsToSentencesMapState,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [englishOnly, setEnglishOnly] = useState(false);
  const [engMaster, setEngMaster] = useState(true);
  const [highlightMode, setHighlightMode] = useState(false);
  const [showReviewSectionState, setShowReviewSectionState] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);

  const {languageSelectedState} = useLanguageSelector();

  const {saveWordFirebase} = useData();

  const {
    seekHandler,
    handlePlayFromThisSentence,
    playFromHere,
    handleVideoPause,
    currentTimeState,
    currentVideoTimeState,
    isVideoPlaying,
    setCurrentVideoTimeState,
    setVideoDurationState,
    playVideo,
    progress,
    videoRef,
    isVideoModeState,
  } = useTopicContentAudio();

  const hasContentToReview = formattedData?.some(
    sentenceWidget => sentenceWidget?.reviewData,
  );

  const {reviewHistory, nextReview, isCore, contentIndex, hasVideo} =
    loadedContent;

  const {height} = Dimensions?.get('window');

  useVideoTextSync({
    currentVideoTimeState,
    setMasterPlay,
    secondsToSentencesMapState,
  });

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
          <View>
            <AudioToggles
              isPlaying={isVideoPlaying}
              playSound={playVideo}
              seekHandler={seekHandler}
              progress={progress}
              setShowReviewSectionState={setShowReviewSectionState}
            />
          </View>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={{
              maxHeight: height * 0.58,
              paddingVertical: 5,
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
              isPlaying={isVideoPlaying}
              pauseSound={handleVideoPause}
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
        </View>
      </View>
    </>
  );
};

export default TopicContentVideoMode;
