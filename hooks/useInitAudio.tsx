import {useEffect} from 'react';
import useLoadAudioInstance from './useLoadAudioInstance';
import useMP3File from './useMP3File';

const useInitAudio = ({soundRef, topicName, url}) => {
  const {loadFile, filePath} = useMP3File(topicName);

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
    loadFile(topicName, url);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return {isLoaded};
};

export default useInitAudio;
