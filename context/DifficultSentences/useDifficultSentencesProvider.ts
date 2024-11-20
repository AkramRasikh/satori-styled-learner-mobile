import {useContext} from 'react';
import {DifficultSentencesContext} from './DifficultSentencesProvider';

const useDifficultSentences = () => {
  const context = useContext(DifficultSentencesContext);

  if (!context)
    throw new Error(
      'useDifficultSentences must be used within a DifficultSentencesProvider',
    );

  return context;
};

export default useDifficultSentences;
