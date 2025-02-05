import {useContext} from 'react';
import {DifficultSentenceAudioContext} from './DifficultSentenceAudioProvider';

const useDifficultSentenceAudio = () => {
  const context = useContext(DifficultSentenceAudioContext);

  if (!context)
    throw new Error(
      'useDifficultSentenceAudio must be used within a DifficultSentenceAudioProvider',
    );

  return context;
};

export default useDifficultSentenceAudio;
