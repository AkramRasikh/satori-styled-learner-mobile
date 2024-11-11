import {Text, TouchableOpacity, View} from 'react-native';
import SoundWidget from './SoundWidget';
import {useEffect, useRef} from 'react';

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
  // const renderCount = useRef(1);

  // // Increment the ref value on each render
  // useEffect(() => {
  //   renderCount.current += 1;
  // });

  // console.log('## DifficultSentenceAudioContainer', renderCount.current);
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
