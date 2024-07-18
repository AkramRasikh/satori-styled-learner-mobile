import {View, Text} from 'react-native';
import ConditionalWrapper from '../utils/conditional-wrapper';
import SatoriLine from './SatoriLine';
import {MiniSnippet} from './Snippet';

const LineContainer = ({
  formattedData,
  playFromThisSentence,
  wordTest,
  englishOnly,
  highlightedIndices,
  setHighlightedIndices,
  saveWordFirebase,
  engMaster,
  isPlaying,
  pauseSound,
  width,
  soundRef,
  snippetsLocalAndDb,
  masterPlay,
  highlightMode,
  seperateLines,
  setIsPlaying,
  setHighlightMode,
  onLongPress,
}) => {
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

            const thisSnippets = snippetsLocalAndDb?.filter(
              item => id === item.sentenceId && item?.saved,
            );

            return (
              <ConditionalWrapper
                key={id}
                condition={seperateLines}
                wrapper={children => (
                  <View
                    style={{
                      width: width * 0.9,
                      marginBottom: 10,
                    }}>
                    {children}
                  </View>
                )}>
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
                    wordTest={wordTest}
                    englishOnly={englishOnly}
                    highlightMode={highlightMode}
                    highlightedIndices={highlightedIndices}
                    setHighlightedIndices={setHighlightedIndices}
                    saveWordFirebase={saveWordFirebase}
                    engMaster={engMaster}
                    isPlaying={isPlaying}
                    pauseSound={pauseSound}
                    safeText={topicSentence.safeText}
                    textWidth={seperateLines ? width * 0.9 : width}
                    setHighlightMode={setHighlightMode}
                    onLongPress={onLongPress}
                  />
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                  }}>
                  {thisSnippets?.map((item, indexB) => {
                    return (
                      <MiniSnippet
                        key={indexB}
                        index={indexB}
                        snippet={item}
                        setMasterAudio={setIsPlaying}
                        masterAudio={isPlaying}
                        soundRef={soundRef}
                      />
                    );
                  })}
                </View>
              </ConditionalWrapper>
            );
          })}
        </Text>
      </View>
    </View>
  );
};

export default LineContainer;
