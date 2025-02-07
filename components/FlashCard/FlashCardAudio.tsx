import React, {useState, useEffect, useRef} from 'react';
import {getFirebaseAudioURL} from '../../hooks/useGetCombinedAudioData';
import useMP3File from '../../hooks/useMP3File';
import useLoadAudioInstance from '../../hooks/useLoadAudioInstance';

import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import SoundWidget from '../WordSoundComponent';
import {Button} from 'react-native-paper';

const FlashCardAudio = ({sentenceData, isMediaContent}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const {languageSelectedState} = useLanguageSelector();

  const soundRef = useRef();

  const id = sentenceData.id;
  const topic = sentenceData.topic;
  const title = sentenceData.fullTitle;
  const audioId = isMediaContent ? title : id;

  const url = getFirebaseAudioURL(audioId, languageSelectedState);

  const {loadFile, filePath} = useMP3File(audioId);

  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
  });

  useEffect(() => {
    if (filePath) {
      triggerLoadURL();
    }
  }, [filePath]);

  const handleLoad = () => {
    loadFile(audioId, url);
  };

  return isLoaded ? (
    <SoundWidget
      soundRef={soundRef}
      url={url}
      topicName={topic}
      sentence={sentenceData}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      currentTimeState={currentTimeState}
      setCurrentTimeState={setCurrentTimeState}
      isMediaContent={isMediaContent}
    />
  ) : (
    <Button
      onPress={handleLoad}
      mode="outlined"
      style={{
        marginBottom: 10,
      }}>
      Load URL
    </Button>
  );
};

export default FlashCardAudio;
