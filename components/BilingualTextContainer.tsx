import React, {useState} from 'react';
import {View, Dimensions} from 'react-native';
import {Text} from 'react-native-paper';
import BilingualLine from './BilingualLine';
import BilingualSnippetContainer from './BilingualSnippetContainer';
import BilingualTextSwipeSRS from './BilingualTextSwipeSRS';

const {width} = Dimensions.get('window');

const BilingualTextContainerWithQuickReviewWrapper = ({
  topicSentence,
  masterPlay,
  highlightTargetTextState,
  snippetsLocalAndDb,
  index,
  playFromThisSentence,
  engMaster,
  isPlaying,
  pauseSound,
  topicName,
  updateSentenceData,
  contentIndex,
  breakdownSentenceFunc,
  handleOpenGoogle,
  scrollViewRef,
  isAutoScrollingMode,
  playSound,
  currentTimeState,
}) => {
  const [showQuickReviewState, setShowQuickReviewState] = useState(false);

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
          display: 'flex',
          flexDirection: 'row',
        }}>
        <View
          style={{
            backgroundColor: highlightedTextState,
            width: showQuickReviewState ? '80%' : 'auto',
          }}>
          <BilingualLine
            id={id}
            focusThisSentence={focusThisSentence}
            topicSentence={topicSentence}
            playFromThisSentence={playFromThisSentence}
            engMaster={engMaster}
            isPlaying={isPlaying}
            pauseSound={pauseSound}
            textWidth={showQuickReviewState ? width * 0.75 : width * 0.9}
            topicName={topicName}
            updateSentenceData={updateSentenceData}
            contentIndex={contentIndex}
            breakdownSentenceFunc={breakdownSentenceFunc}
            handleOpenGoogle={handleOpenGoogle}
            scrollViewRef={scrollViewRef}
            isAutoScrollingMode={isAutoScrollingMode}
            setShowQuickReviewState={setShowQuickReviewState}
          />
        </View>
        {showQuickReviewState && (
          <BilingualTextSwipeSRS
            setShowQuickReviewState={setShowQuickReviewState}
            sentence={topicSentence}
            updateSentenceData={updateSentenceData}
            contentIndex={contentIndex}
          />
        )}
      </View>

      {thisSnippets?.map((snippetData, index) => {
        return (
          <BilingualSnippetContainer
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
};

const BilingualTextContainer = ({
  formattedData,
  playFromThisSentence,
  engMaster,
  isPlaying,
  pauseSound,
  snippetsLocalAndDb,
  masterPlay,
  topicName,
  updateSentenceData,
  currentTimeState,
  playSound,
  highlightTargetTextState,
  contentIndex,
  breakdownSentenceFunc,
  handleOpenGoogle,
  scrollViewRef,
  isAutoScrollingMode,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      <Text style={{fontSize: 20}}>
        {formattedData?.map((topicSentence, index) => {
          if (topicSentence.targetLang === '') return null;

          return (
            <BilingualTextContainerWithQuickReviewWrapper
              key={index}
              topicSentence={topicSentence}
              masterPlay={masterPlay}
              highlightTargetTextState={highlightTargetTextState}
              snippetsLocalAndDb={snippetsLocalAndDb}
              index={index}
              playFromThisSentence={playFromThisSentence}
              engMaster={engMaster}
              isPlaying={isPlaying}
              pauseSound={pauseSound}
              topicName={topicName}
              updateSentenceData={updateSentenceData}
              contentIndex={contentIndex}
              breakdownSentenceFunc={breakdownSentenceFunc}
              handleOpenGoogle={handleOpenGoogle}
              scrollViewRef={scrollViewRef}
              isAutoScrollingMode={isAutoScrollingMode}
              playSound={playSound}
              currentTimeState={currentTimeState}
            />
          );
        })}
      </Text>
    </View>
  );
};

export default BilingualTextContainer;
