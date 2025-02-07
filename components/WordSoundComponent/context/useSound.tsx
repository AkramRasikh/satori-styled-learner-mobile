import {useContext} from 'react';
import {SoundContext} from './SoundProvider';

const useSound = () => {
  const context = useContext(SoundContext);

  if (!context)
    throw new Error('useSound must be used within a SoundContextProvider');

  return context;
};

export default useSound;
