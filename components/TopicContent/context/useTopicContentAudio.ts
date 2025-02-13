import {useContext} from 'react';
import {TopicContentAudioContext} from './TopicContentAudioProvider';

const useTopicContentAudio = () => {
  const context = useContext(TopicContentAudioContext);

  if (!context)
    throw new Error(
      'useTopicContentAudio must be used within a TopicContentAudioProvider',
    );

  return context;
};

export default useTopicContentAudio;
