import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import BilingualLine from './BilingualLine';
import BilingualSnippetContainer from './BilingualSnippetContainer';

const {width} = Dimensions.get('window');

const BilingualTextContainer = ({
  formattedData,
  playFromThisSentence,
  englishOnly,
  highlightedIndices,
  setHighlightedIndices,
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
}) => (
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
              <BilingualLine
                id={id}
                sentenceIndex={index}
                focusThisSentence={focusThisSentence}
                topicSentence={topicSentence}
                playFromThisSentence={playFromThisSentence}
                englishOnly={englishOnly}
                highlightedIndices={highlightedIndices}
                setHighlightedIndices={setHighlightedIndices}
                engMaster={engMaster}
                isPlaying={isPlaying}
                pauseSound={pauseSound}
                textWidth={width * 0.9}
                topicName={topicName}
                updateSentenceData={updateSentenceData}
                contentIndex={contentIndex}
                breakdownSentenceFunc={breakdownSentenceFunc}
                handleOpenGoogle={handleOpenGoogle}
                scrollViewRef={scrollViewRef}
                isAutoScrollingMode={isAutoScrollingMode}
              />
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
      })}
    </Text>
  </View>
);

export default BilingualTextContainer;
