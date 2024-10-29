import {View, Text} from 'react-native';
import SatoriLine from './SatoriLine';
import {MiniSnippet} from './MiniSnippet';

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
  setIsPlaying,
  setHighlightMode,
  onLongPress,
  topicName,
  updateSentenceData,
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
            const firstEl = index === 0;

            const thisSnippets = snippetsLocalAndDb?.filter(
              item => id === item.sentenceId && item?.saved,
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
                    textWidth={width * 0.9}
                    setHighlightMode={setHighlightMode}
                    onLongPress={onLongPress}
                    topicName={topicName}
                    updateSentenceData={updateSentenceData}
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
              </View>
            );
          })}
        </Text>
      </View>
    </View>
  );
};

export default LineContainer;
