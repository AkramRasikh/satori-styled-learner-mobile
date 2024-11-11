import {Text, TouchableOpacity, View} from 'react-native';
import SoundWidget from './SoundWidget';

const DifficultSentenceAudioContainer = ({
  isLoaded,
  soundRef,
  url,
  topic,
  handleSnippet,
  sentence,
  isPlaying,
  setIsPlaying,
  currentTimeState,
  setCurrentTimeState,
  handleLoad,
  isMediaContent,
}) => {
  if (isLoaded) {
    return (
      <SoundWidget
        soundRef={soundRef}
        url={url}
        topicName={topic}
        handleSnippet={handleSnippet}
        sentence={sentence}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentTimeState={currentTimeState}
        setCurrentTimeState={setCurrentTimeState}
        isMediaContent={isMediaContent}
      />
    );
  }
  return (
    <View>
      <TouchableOpacity onPress={handleLoad}>
        <Text>Load URL</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DifficultSentenceAudioContainer;
