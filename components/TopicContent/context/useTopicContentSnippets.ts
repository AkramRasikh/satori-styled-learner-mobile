import {useContext} from 'react';
import {TopicContentSnippetsContext} from './TopicContentSnippetsProvider';

const useTopicContentSnippets = () => {
  const context = useContext(TopicContentSnippetsContext);

  if (!context)
    throw new Error(
      'useTopicContentSnippets must be used within a TopicContentSnippetsProvider',
    );

  return context;
};

export default useTopicContentSnippets;
