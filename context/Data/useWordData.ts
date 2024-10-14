import {useContext} from 'react';
import {WordDataContext} from './WordDataProvider';

const useWordData = () => {
  const context = useContext(WordDataContext);

  if (!context)
    throw new Error('useWordData must be used within a DataProvider');

  return context;
};

export default useWordData;
