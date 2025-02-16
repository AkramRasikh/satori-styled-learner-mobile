import {useContext} from 'react';
import {ContentScreenContext} from './ContentScreenProvider';

const useContentScreen = () => {
  const context = useContext(ContentScreenContext);

  if (!context)
    throw new Error(
      'useContentScreen must be used within a ContentScreenProvider',
    );

  return context;
};

export default useContentScreen;
