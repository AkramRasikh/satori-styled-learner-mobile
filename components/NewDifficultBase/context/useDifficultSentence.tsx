import {useContext} from 'react';
import {DifficultSentenceContext} from './DifficultSentenceProvider';

const useDifficultSentenceContext = () => {
  const context = useContext(DifficultSentenceContext);

  if (!context)
    throw new Error(
      'useDifficultSentenceContext must be used within a DifficultSentenceContextProvider',
    );

  return context;
};

export default useDifficultSentenceContext;
