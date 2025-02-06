import {useContext} from 'react';
import {FlashCardContext} from './FlashCardProvider';

const useFlashCard = () => {
  const context = useContext(FlashCardContext);

  if (!context)
    throw new Error(
      'useFlashCard must be used within a FlashCardContextProvider',
    );

  return context;
};

export default useFlashCard;
