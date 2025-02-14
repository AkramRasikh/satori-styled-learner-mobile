import {useContext} from 'react';
import {TopicContentVideoContext} from './TopicContentVideoProvider';

const useTopicContentVideo = () => {
  const context = useContext(TopicContentVideoContext);

  if (!context)
    throw new Error(
      'useTopicContentVideo must be used within a TopicContentVideoProvider',
    );

  return context;
};

export default useTopicContentVideo;
